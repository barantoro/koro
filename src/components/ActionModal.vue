<template>
  <div class="backdrop" v-if="modalActive" @click="$emit('close-modal')" tabindex="-1" aria-labelledby="modalTitle" role="dialog">
    <Teleport to="body">
      <Transition name="modal-outer">
        <div v-show="modalActive" class="modal" role="document" aria-modal="true">
          <Transition name="modal-inner">
            <div v-if="modalActive">
              <div class="modal-header">
                <div class="flex-cs gap-30">
                  <h2 v-if="post.id" id="modalTitle">Edit - {{ post.title }}</h2>
                  <h2 v-else id="modalTitle">Create new post</h2>
                  <XMarkIcon @click="$emit('close-modal')" class="close-icon" tabindex="0" aria-label="Close modal"/>
                </div>
              </div>
              
              <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
                <div class="modal-body mt-2" v-if="!loader">
                  <div>
                    <label for="title">Title *</label>
                    <Field name="title" type="text" class="input mt-2" v-model="post.title" aria-labelledby="title" :class="{ 'error-input': errors.title }" />
                    <span class="error-msg">{{errors.title}}</span>
                  </div>

                  <div class="mt-2">
                    <label for="authors">Author *</label>
                    <Field name="userId" as="select" class="select mt-2" :class="{ 'error-input': errors.userId }" v-model="post.userId" aria-labelledby="authors" >
                        <option value="">Please select</option>
                        <option 
                          :value="author.id" 
                          v-for="author in authors" 
                          :key="author.id"
                        >
                          {{ author.name }}
                        </option>
                    </Field>
                    <div class="error-msg">{{errors.userId}}</div>
                  </div>

                  <div class="mt-4">
                    <label for="description">Description</label>
                    <div class="mt-2 br-8">
                      <ckeditor :editor="editor" v-model="post.body" :config="editorConfig" aria-labelledby="postBody"></ckeditor>
                    </div>
                  </div>  
                </div>

                <div class="modal-body mt-2" v-else>
                  <div>
                    <label for="title">Title *</label>
                    <ContentPlaceholder class="mt-2" :textLine="1" />
                  </div>

                  <div class="mt-2">
                    <label for="authors">Author *</label>
                    <ContentPlaceholder class="mt-2" :textLine="1" />
                  </div>

                  <div class="mt-4">
                    <label for="description">Description</label>
                    <div class="mt-2 br-8">
                      <ContentPlaceholder class="mt-2" :textLine="10" />
                    </div>
                  </div>  
                </div>

                <div class="modal-footer mt-4">
                  <button @click="$emit('close-modal')" aria-label="Close modal">
                    Close
                  </button>
                  <button type="submit" v-if="post.id" aria-label="Save changes" :class="{'op-5' : loader}" :disabled="loader">
                    Save changes
                  </button>
                  <button type="submit" v-else aria-label="Create new post">
                    Create new post
                  </button>
                </div>
              </Form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'
import { createPost, getSinglePost, updatePost } from '../../api';
import ContentPlaceholder from './ContentPlaceholder.vue';

const loader = ref(true)

const editor = ClassicEditor
const ckeditor = CKEditor.component

const editorConfig = { 
  toolbar: [
    'undo', 'redo',
    '|', 'heading',
    '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
    '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
    '|', 'link', 'blockQuote', 'codeBlock',
    '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
  ]
}

const emits = defineEmits(["close-modal", "reload-data"]);
const props = defineProps({
  modalActive: {
    type: Boolean,
    default: false,
  },
  post: {
    type: Object,
    default: {
      title: '',
      body: '',
      userId: ''
    }
  },
  authors: {
    type: Array,
    default: []
  }
});

import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    userId: Yup.string().required('Author is required'),
});

const singlePostId = ref('');

watch(() => props.post, async (val) => {
  if(val && Object.keys(val).length > 0) {
    singlePostId.value = val.id
  }
});

const getSinglePostById = async () => {
  setTimeout( async () => {
    loader.value = true
    const singlePost = await getSinglePost(singlePostId.value)
    props.post = singlePost
    loader.value = false
  }, 100);
}

defineExpose({
  getSinglePostById,
});

const onSubmit = async (value) => {
  props.post.id ? updateExistingPost(props.post) : createNewPost(props.post)
}

const createNewPost = async () => { 
  try {
    await createPost(props.post);
    showSuccessMessage('Post', 'created successfully!');
    emits("close-modal");
    emits("reload-data")
    clearFields();
  } catch (error) {
    console.error('Error creating post:', error);
    emits("close-modal");
    showErrorMessage('Error creating post. Please try again later.');
  }
};

const updateExistingPost = async () => { 
  try {
    await updatePost(props.post.id, props.post);
    showSuccessMessage('Post', 'updated successfully!');
    emits("close-modal");
    emits("reload-data")
    clearFields();
  } catch (error) {
    console.error('Error updating post:', error);
    emits("close-modal");
    showErrorMessage('Error updating post. Please try again later.');
  }
};

const clearFields = () => {
  props.post.title = '';
  props.post.body = '';
  props.post.userId = '';
};

const showSuccessMessage = (title, message) => {
  Swal.fire({
    title: `${title} ${message}`,
    icon: "success",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
};

const showErrorMessage = (message) => {
  Swal.fire({
    title: message,
    icon: "error",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
};
</script>


<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-inner-leave-to {
  transform: scale(0.8);
}
.modal {
  width: 100%;
  max-width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: #fff;
  padding: 1rem 2rem;
  border-radius: 12px;
}
.backdrop {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
.modal-header {
  border-bottom: 1px solid;
}
.modal-header h2 {
  font-size: 20px;
}
.close-icon {
  width: 100%;
  max-width: 24px;
}
.input {
  width: 100%;
  padding: .5rem;
  border-radius: 8px;
  border: 1px solid #000;
  box-sizing: border-box;
}
.select {
  width: 100%;
  padding: .5rem;
  border-radius: 8px;
  border: 1px solid #000;
  box-sizing: border-box;
}
.modal-body label {
  font-size: 12px;
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.modal-footer button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: .5rem 1rem;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: .5s;
}
.modal-footer button:first-child {
  border: 1px solid #49c5b6;
  color: #49c5b6;;
  background: #fff;
}
.modal-footer button:first-child:hover {
  border: 1px solid #2e9f91;
  color: #2e9f91;;
  background: #fff;
  transition: .5s;
}
.modal-footer button:nth-child(2) {
  border: 1px solid #DF6C4F;
  color: #fff;;
  background: #DF6C4F;
}
.modal-footer button:nth-child(2):hover {
  border: 1px solid #ce583b;
  background: #ce583b;
  transition: .5s;
}
.error-msg {
  font-size: 12px;
  font-weight: 600;
  color: #FF0000;
}
.error-msg::first-letter {
    text-transform: uppercase;
}
.error-input {
  border: 1px solid #FF0000;
  /* color: #FF0000; */
  transition: 1s;
}
</style>