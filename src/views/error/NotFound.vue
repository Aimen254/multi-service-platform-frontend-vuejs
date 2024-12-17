<script setup>
import { useTagStore } from '@stores/tags'
import { useUserStore } from '@stores/user';

const tagStore = useTagStore()
const userStore = useUserStore()

const goToHomePage = () => {
    // remove owner
    userStore.removeOwner()

    // remove tag levels
    tagStore.removeLevelOneTag()
    tagStore.removeLevelTwoTag()
    tagStore.removeLevelThreeTag()
    tagStore.removeLevelFourTag()
}

</script>
<template>
    <!-- Error -->
    <div class="container-xxl container-p-y">
        <div class="misc-wrapper">
            <h2 class="mb-2 mx-2">Page Not Found</h2>
            <p class="mb-4 mx-2">Oops! 😖 The requested URL was not found on this server.</p>
            <router-link :to="{ name: 'home' }" class="btn btn-primary" @click="goToHomePage()">Back to home</router-link>
            <div class="mt-3">
                <img src="@/assets/images/error/page-misc-error-light.png" alt="page-misc-error-light" width="500"
                    class="img-fluid" data-app-dark-img="illustrations/page-misc-error-dark.png"
                    data-app-light-img="illustrations/page-misc-error-light.png" />
            </div>
        </div>
    </div>
</template>

<style>
.misc-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - (1.625rem * 2));
    text-align: center;
}
</style>