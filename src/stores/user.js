import { ref, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import { AES, enc } from 'crypto-js' // Import crypto-js for encryption and decryption
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useTagStore } from './tags'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const users = ref([])
  const favoriteUsers = ref([])
  const secretKey = import.meta.env.VITE_APP_SECRET_KEY
  const route = useRoute();
  const owner = ref()
  const tagStore = useTagStore()

  // Load user data from localStorage when the store is first created
  onBeforeMount(() => {
    const encryptedUserData = localStorage.getItem('user');
    if (encryptedUserData) {
      const decryptedUserData = decryptData(encryptedUserData, secretKey);
      if (decryptedUserData) {
        setUser(decryptedUserData);
      }
    }
    const author = localStorage.getItem('author')
    if (author) {
      saveOwner(JSON.parse(author))
    }
  })

  // set user
  function setUser(userData) {
    const newUser = user.value
      ? {
        ...user.value,
        avatar: userData.avatar,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        email: userData.email,
        about: userData.about,
        cover_img: userData.cover_img,
        user_type: userData.user_type
      }
      : userData;

    const encryptedUserData = encryptData(newUser, secretKey);
    user.value = newUser;

    localStorage.setItem('user', encryptedUserData);

  }

  // remove user  
  function unSet() {
    user.value = null,
      // Remove user data from localStorage on logout
      localStorage.removeItem('user')
  }

  const removeFavoriteUsers = () => {
    favoriteUsers.value = [];
  }


  // set users
  function setUsers(data) {
    users.value = data
  }

  const updateUserInList = (userId, inWishlist) => {
    const updatedUsers = users.value.map(user => {
      if (user.id === userId) {
        return { ...user, in_wishlist: inWishlist };
      }
      return user;
    });
    users.value = updatedUsers;
  };


  // save faorite user
  function saveFavoriteUser(data, flag = false, type = 'array') {
    if (type == 'object') {
      if (flag) {
        // Add the user to the favorite user array
        const newItem = {
          id: 0, // dummy id
          user: data
        };
        favoriteUsers.value.push(newItem)
      } else {
        // Find the index of the user in the array
        const index = favoriteUsers.value.findIndex((item) => item.user.id == data.id);

        // Check if the user is in the array
        if (index !== -1) {
          // Remove the user from the favorite users array
          favoriteUsers.value.splice(index, 1)
        }
      }
    } else {
      favoriteUsers.value = data
    }

  }

  // update favorit user's product wishlist stauts
  function updateFavoriteUserProductWislistStatus(item, in_wishlist) {
    favoriteUsers.value.forEach(favoriteUser => {
      if (favoriteUser.user) {
        const productIndex = favoriteUser?.user?.products.findIndex(product => product.id === item.id);
        if (productIndex !== -1) {
          favoriteUser.user.products[productIndex].in_wishlist = in_wishlist;
        }
      }
    })
  }

  // remove tags from store
  function removeTags() {
    tagStore.removeLevelTwoTag();
    tagStore.removeLevelThreeTag();
    tagStore.removeLevelFourTag();
  }

  // save owner in store to navigate to author pages or owner pages
  function saveOwner(item) {
    owner.value = item
    localStorage.setItem('author', JSON.stringify(item))
  }

  // remove owner from store
  function removeOwner() {
    owner.value = null
    localStorage.removeItem('author')
  }

  // get favoriteUsersList latest 10
  const getFavoriteUsers = computed(() => {
    if (route.name !== 'favorite-authors') {
      return favoriteUsers.value.slice(-10)
    } else {
      return favoriteUsers.value
    }
  })

  // get owner/author
  const getOwner = computed(() => {
    return owner.value
  })


  return { user, setUser, unSet, users, setUsers, updateUserInList, getFavoriteUsers, saveFavoriteUser, updateFavoriteUserProductWislistStatus, saveOwner, getOwner, removeOwner, removeFavoriteUsers }
})


// Function to encrypt data
function encryptData(data, key) {
  const encryptedData = AES.encrypt(JSON.stringify(data), key).toString();
  return encryptedData;
}

// Function to decrypt data
function decryptData(encryptedData, key) {
  const bytes = AES.decrypt(encryptedData, key);
  const decryptedData = JSON.parse(bytes.toString(enc.Utf8))
  return decryptedData
}