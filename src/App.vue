<script setup>
import { ref, onMounted, computed } from 'vue';
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
import ActionModal from './components/ActionModal.vue';
import Swal from 'sweetalert2';
import { fetchPosts, fetchUsers, deletePost } from '../api';

const posts = ref([]);
const updatePost = ref({})
const users = ref([]);
const search = ref('');
const checkAll = ref(false);
const selectedPosts = ref([]);
const showModal = ref(false);
const modalActive = ref(null);
const activeDropdown = ref(null);

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        await fetchPosts(posts);
        await fetchUsers(users);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const toggleModal = (post) => {
    post ? updatePost.value = post : updatePost.value = {} // check
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

const findAuthor = (id) => {
    const user = users.value.find(user => user.id === id);
    return user ? user.name : id;
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
    <!-- <router-view/> -->
    <div class="container mt-5">
        <div class="flex-cs w-100 gap-30">
            <div class="w-100 relative">
                <MagnifyingGlassIcon class="magnifying-glass" />
                <input 
                    type="text" 
                    placeholder="Search by title or description" 
                    class="w-100 search-bar" 
                    v-model="search"
                    aria-label="Search input"
                > 
            </div>
            <button 
                class="minw-200 btn" 
                @click="toggleModal()"
                aria-label="Create new post button"
            >Create new post</button>
        </div>

        <div class="table-wrapper mt-4">
            <table class="w-100">
                <thead>
                    <tr>
                        <th scope="col">
                            <input 
                                type="checkbox" 
                                v-model="checkAll" 
                                @change="toggleSelectAll"
                                aria-label="Select all posts checkbox"
                            >
                        </th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Author</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in filteredList" :key="post.id">
                        <td> 
                            <input 
                                type="checkbox" 
                                :checked="selectedPosts.includes(post)" 
                                @change="togglePostSelection(post)"
                                aria-label="Select post checkbox"
                            >
                        </td>
                        <td class="semi-bold maxw-250"> {{ post.title }}</td>
                        <td class="maxw-365">
                            <div>
                                <span v-if="!post.showFullBody">{{ truncatePostBody(post.body) }}</span>
                                <span v-else>{{ post.body }}</span>
                                <span 
                                    class="show-more" 
                                    @click="toggleBodyDisplay(post)"
                                    role="button"
                                    tabindex="0"
                                    aria-expanded="post.showFullBody ? 'true' : 'false'"
                                    aria-label="Toggle post body display"
                                >
                                    {{ post.showFullBody ? 'Show Less' : 'Show More' }}
                                </span>
                            </div>
                        </td>
                        <td class="semi-bold">
                            <div class="author-dropdown flex-cs">
                                <span>{{ findAuthor(post.userId) }}</span>
                                <button 
                                    @click="toggleDropdown(post.id)"
                                    aria-label="Open dropdown menu"
                                >
                                    <EllipsisVerticalIcon class="ellipsis-dropdown" />
                                </button>
                                <div 
                                    v-if="activeDropdown === post.id" 
                                    class="dropdown-content"
                                    aria-label="Dropdown menu"
                                >
                                    <a 
                                        href="#" 
                                        @click="toggleModal(post)"
                                        aria-label="Edit post link"
                                    >Edit</a>
                                    <a 
                                        href="#" 
                                        @click="confirmDeletePost(post.id)"
                                        aria-label="Delete post link"
                                    >Delete</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      <!-- {{ selectedPosts }} -->        
      <ActionModal
        :modalActive="modalActive"
        @close-modal="toggleModal"
        @reload-data="fetchData"
        :authors="users"
        :post="updatePost"
      />
    </div>
</template>


<style scoped>

</style>

