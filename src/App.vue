<script setup>
import { ref, onMounted, computed } from 'vue';
import { MagnifyingGlassIcon, EllipsisVerticalIcon, TrashIcon, PencilIcon, EnvelopeIcon, PhoneIcon, BuildingOffice2Icon} from '@heroicons/vue/24/outline';
import ActionModal from './components/ActionModal.vue';
import ContentPlaceholder from './components/ContentPlaceholder.vue';
import Swal from 'sweetalert2';
import { fetchPosts, fetchUsers, deletePost } from '../api';

const posts = ref([]);
const selectedPostForUpdate = ref({})
const users = ref([]);
const search = ref('');
const checkAll = ref(false);
const selectedPosts = ref([]);
const modalActive = ref(null);
const activeDropdown = ref(null);
const loader = ref(true)

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        loader.value = true
        await fetchPosts(posts);
        await fetchUsers(users);
        loader.value = false
    } catch (error) {
        console.error('Error fetching data:', error);
        loader.value = false
    }
};

const toggleModal = (post) => {
    post ? selectedPostForUpdate.value = post : selectedPostForUpdate.value = {} // check
    modalActive.value = !modalActive.value;
};

const toggleSelectAll = () => {
    if (checkAll.value) {
        selectedPosts.value = [...posts.value];
    } else {
        selectedPosts.value = [];
    }
};

const togglePostSelection = (post) => {
    if (selectedPosts.value.includes(post)) {
        selectedPosts.value = selectedPosts.value.filter(p => p !== post);
    } else {
        selectedPosts.value.push(post);
    }
};

const truncatePostBody = (body) => {
    const maxLength = 45;
    if (body.length <= maxLength) {
        return body;
    } else {
        return body.substring(0, maxLength) + '...';
    }
};

const toggleBodyDisplay = (post) => {
    post.showFullBody = !post.showFullBody;
};

const child = ref(null)

const callChildMethod = () => {
  child.value.getSinglePostById()
}

const findAuthor = (id) => {
    const user = users.value.find(user => user.id === id);
    return user ? user : id;
};

const toggleDropdown = (postId) => {
    activeDropdown.value = activeDropdown.value === postId ? null : postId;
};

const confirmDeletePost = async (postId) => {
    try {
        const result = await Swal.fire({
            title: "Do you want to delete the post?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
        });
        if (result.isConfirmed) {
            await deletePost(postId);
            await fetchData();
            Swal.fire("Deleted!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

const filteredList = computed(() => {
    return posts.value.filter(post => {
        return post.title.toLowerCase().includes(search.value.toLowerCase()) ||
               post.body.toLowerCase().includes(search.value.toLowerCase());
    });
});
</script>


<template>
    <div class="container mt-5">
        <div class="flex-cs w-100 gap-30 mobile-reverse">
            <div class="w-100 relative">
                <MagnifyingGlassIcon class="magnifying-glass" />
                <input type="text" placeholder="Search by title or description" class="w-100 search-bar" v-model="search" aria-label="Search input"> 
            </div>
            <button class="minw-200 btn" @click="toggleModal()" aria-label="Create new post button">
                Create new post
            </button>
        </div>

        <div class="table-wrapper mt-4">
            <table class="w-100" v-if="!loader">
                <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox" v-model="checkAll" @change="toggleSelectAll" aria-label="Select all posts checkbox">
                        </th>
                        <th scope="col">
                            Title
                        </th>
                        <th scope="col">
                            Description
                        </th>
                        <th scope="col">
                            Author
                        </th>
                    </tr>
                </thead>
                <tbody v-if="filteredList.length>0">
                    <tr v-for="post in filteredList" :key="post.id">
                        <td> 
                            <input type="checkbox" :checked="selectedPosts.includes(post)" @change="togglePostSelection(post)" aria-label="Select post checkbox">
                        </td>
                        <td class="maxw-250" data-label="Title">
                            {{ post.title }}
                        </td>
                        <td class="maxw-365" data-label="Description">
                            <div class="description-wrapper">
                                <span v-if="!post.showFullBody">{{ truncatePostBody(post.body) }}</span>
                                <span v-else>{{ post.body }}</span>
                                <span class="show-more"  @click="toggleBodyDisplay(post)" role="button" tabindex="0" aria-expanded="post.showFullBody ? 'true' : 'false'" aria-label="Toggle post body display">
                                    {{ post.showFullBody ? 'Show Less' : 'Show More' }}
                                </span>
                            </div>
                        </td>
                        <td data-label="Author">
                            <div class="author-dropdown flex-cs">
                                <div class="author-img-wrapper tooltip">
                                    <span class="tooltiptext">
                                        <div class="author-info-wrapper">
                                            <div class="author-info">
                                                <EnvelopeIcon class="ico" /> <span>{{ findAuthor(post.userId).email }}</span>
                                            </div>
                                            <div class="author-info">
                                                <PhoneIcon class="ico" /> <span>{{ findAuthor(post.userId).phone }}</span>
                                            </div>
                                            <div class="author-info">
                                                <BuildingOffice2Icon class="ico" /> <span>{{ findAuthor(post.userId).company.name }}</span>
                                            </div>
                                        </div>
                                    </span>
                                    <img :src='`https://i.pravatar.cc/150?img=${post.userId}`' >
                                    <span>{{ findAuthor(post.userId).name }}</span>
                                </div>
                                <button @click="toggleDropdown(post.id)" aria-label="Open dropdown menu">
                                    <EllipsisVerticalIcon class="ellipsis-dropdown" />
                                </button>
                                <div 
                                    v-if="activeDropdown === post.id" class="dropdown-content" aria-label="Dropdown menu">
                                    <a href="#" @click="toggleModal(post),callChildMethod()" aria-label="Edit post link">
                                        <PencilIcon class="dropdown-icon" />
                                        Edit
                                    </a>
                                    <a href="#" @click="confirmDeletePost(post.id)" aria-label="Delete post link">
                                        <TrashIcon class="dropdown-icon" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ContentPlaceholder :textLine="24" v-else />
            <p class="no-result" v-if="filteredList.length === 0">Houston, we have a problem... No results found! 🚀🔍</p>
        </div>
      <!-- {{ selectedPosts }} -->        
      <ActionModal
        :modalActive="modalActive"
        @close-modal="toggleModal"
        @reload-data="fetchData"
        :authors="users"
        :post="selectedPostForUpdate"
        ref="child"
      />
    </div>
</template>


<style scoped>

</style>

