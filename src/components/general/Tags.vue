<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount, onBeforeMount, inject } from "vue";
import { useRoute } from "vue-router";
import { useTagsApi } from "@composables/tagLevels";
import BackButtonSvg from "@components/icons/BackButtonSvg.vue";
import SliderSvg from "@components/icons/SliderSvg.vue";
import Button from '@components/core/Button.vue'
import Select2 from 'vue3-select2-component';
import { useRouter } from 'vue-router';
const router = useRouter();

// level store tags
import { useTagStore } from '@/stores/tags'
const tagStore = useTagStore()

// user store
import { useUserStore } from '@stores/user'
const userStore = useUserStore()

const route = useRoute();
const { levelTwoTags, levelThreeTags, levelFourTags } = useTagsApi();

const eventBus = inject('eventBus')

const slideGroup = ref(null);

const levelTwoTag = ref([]);
const levelThreeTag = ref([]);
const levelFourTag = ref([]);



const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
    screenWidth.value = window.innerWidth;
};

// set level One options
const levelOneOptions = computed(() => {
    if (userStore.getOwner) {
        return [{ id: userStore.getOwner.id, text: userStore.getOwner.name }]
    } else {
        return tagStore.getLevelOneTags
    }
})

const tags = computed(() => {
    if (levelThree.value) {
        return levelFourTag.value
    }
    else if (levelTwo.value) {
        return levelThreeTag.value
    }
    else if (levelOne.value) {
        return levelTwoTag.value
    } else {
        return tagStore.getLevelOneTags
    }
})

const levelOne = computed(() => {
    if (userStore.getOwner) {
        return userStore.getOwner.id
    } else {
        return tagStore.getLevelOneTagId
    }
})

const levelTwo = computed(() => {
    return tagStore.getLevelTwoTagId
});

const levelThree = computed(() => {
    return tagStore.getLevelThreeTagId;
});

const levelFour = computed(() => {
    return tagStore.getLevelFourTagId;
});

const levelOneSlug = computed(() => {
    return tagStore.getLevelOneTagSlug;
});



const activeTag = computed(() => (tag) => {
    return (tagStore.getLevelOneTagId && tagStore.getLevelOneTagId == tag.id) || (route.params.levelFourslug && route.params.levelFourslug == tag.slug)
})

// active in active
const handleTagsClick = (tag) => {
    if (levelFourTag.value.length > 0) {
        levelFourTagChange(tag)
    } else if (levelThreeTag.value.length > 0) {
        levelThreeTagChange(tag)
    } else if (levelTwoTag.value.length > 0) {
        levelTwoTagChange(tag)
    } else {
        levelOneTagCahnge(tag)
    }
};


// slider logic


// levelone change
const levelOneTagCahnge = async (e) => {
    const levelOneTagId = e.id
    const levelOneTagSlug = e.slug
    levelTwoTag.value = [];
    levelThreeTag.value = [];
    levelFourTag.value = [];
    tagStore.removeLevelTwoTag()
    tagStore.removeLevelThreeTag()
    tagStore.removeLevelFourTag()
    tagStore.saveLevelOneTag({ levelOneTagId, levelOneTagSlug })
    router.push({
        name: 'level-one-page',
        params: { levelOneslug: e.slug }
    })
}

// level two change
const levelTwoTagChange = async (e) => {
    const levelTwoTagId = e.id;
    const levelTwoTagSlug = e.slug;
    levelThreeTag.value = [];
    levelFourTag.value = [];
    tagStore.removeLevelThreeTag()
    tagStore.removeLevelFourTag()
    tagStore.saveLevelTwoTag({ levelTwoTagId, levelTwoTagSlug });
    if (userStore.getOwner) {
        router.push({
            name: 'owner-level-two',
            params: {
                name: userStore.getOwner.type === 'business' ? userStore.getOwner.slug : userStore.getOwner.name,
                levelOneSlug: levelOneSlug.value,
                levelTwoslug: e.slug,
            }
        })
    } else {
        router.push({
            name: 'level-two-page',
            params: {
                levelOneslug: levelOneSlug.value,
                levelTwoslug: e.slug,
            }
        })
    }
    levelThreeTag.value = await levelThreeTags(tagStore.getLevelOneTagId, tagStore.getLevelTwoTagId, { limit: 20, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : '', 'level-four-count': true });
}
// level three change
const levelThreeTagChange = async (e) => {
    const levelThreeTagId = e.id;
    const levelThreeTagSlug = e.slug;
    levelFourTag.value = [];
    tagStore.removeLevelFourTag()
    tagStore.saveLevelThreeTag({ levelThreeTagId, levelThreeTagSlug });
    if (e.level_four_tag) {
        levelFourTagChange(e.level_four_tag)
    } else {
        if (userStore.getOwner) {
            router.push({
                name: 'owner-level-three',
                params: {
                    name: userStore.getOwner.type === 'business' ? userStore.getOwner.slug : userStore.getOwner.name,
                    levelOneslug: levelOneSlug.value,
                    levelTwoslug: tagStore.getLevelTwoTagSlug,
                    levelThreeslug: e.slug,
                }
            })
        } else {
            router.push({
                name: 'level-three-page',
                params: {
                    levelOneslug: levelOneSlug.value,
                    levelTwoslug: tagStore.getLevelTwoTagSlug,
                    levelThreeslug: e.slug,
                }
            })
        }
    }
    levelFourTag.value = await levelFourTags(tagStore.getLevelOneTagId, tagStore.getLevelTwoTagId, tagStore.getLevelThreeTagId, { limit: 20, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : '' }, false);
}

// level four 
const levelFourTagChange = async (e) => {
    const levelFourTagId = e.id;
    const levelFourTagSlug = e.slug;
    tagStore.saveLevelFourTag({ levelFourTagId, levelFourTagSlug });

    if (userStore.getOwner) {
        router.push({
            name: 'owner-level-four',
            params: {
                name: userStore.getOwner.type === 'business' ? userStore.getOwner.slug : userStore.getOwner.name,
                levelOneslug: levelOneSlug.value,
                levelTwoslug: tagStore.getLevelTwoTagSlug,
                levelThreeslug: tagStore.getLevelThreeTagSlug,
                levelFourslug: levelFourTagSlug
            }
        })
    } else {
        router.push({
            name: 'level-four-page',
            params: {
                levelOneslug: levelOneSlug.value,
                levelTwoslug: tagStore.getLevelTwoTagSlug,
                levelThreeslug: tagStore.getLevelThreeTagSlug,
                levelFourslug: levelFourTagSlug
            }
        })
    }
}

watch(
    () => route.params,
    async (newParams, oldParams) => {
        if (route?.name == 'level-one-page' || route?.name == 'owner-level-one') {
            const tag = tagStore.levelOneTags.find(tag => tag.slug == route.params?.levelOneslug);
            const levelOneTagId = tag.id
            const levelOneTagSlug = tag.slug
            tagStore.saveLevelOneTag({ levelOneTagId, levelOneTagSlug })
            tagStore.removeLevelTwoTag()
            tagStore.removeLevelThreeTag()
            tagStore.removeLevelFourTag()
            const params = {
                limit: 20,
                [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : null
            }
            levelTwoTag.value = []
            levelThreeTag.value = []
            levelFourTag.value = []
            levelTwoTag.value = await levelTwoTags(tagStore.getLevelOneTagId, params, false);
        }
        if (route?.name == 'home') {
            tagStore.removeLevelOneTag()
            levelTwoTag.value = []
            levelThreeTag.value = []
            levelFourTag.value = []
        }

        // reseting the v-slide-group positioning
        if (slideGroup.value) {
            slideGroup.value.scrollOffset = 0;
        }
        if (route.name === 'level-two-page' || route.name === 'level-three-page' || route.name === 'level-four-page') {
            checkLevelOne()
        }
    }
);

onMounted(async () => {
    eventBus.on('levelFour', async (args) => {
        console.log('dsdsdsd');
        if (args.category) {
            // set level two
            const levelTwoTagId = args?.category?.maker?.id;
            const levelTwoTagSlug = args?.category?.maker?.slug;
            tagStore.saveLevelTwoTag({ levelTwoTagId, levelTwoTagSlug });
        }
        // set level three 
        const levelThreeTagId = args?.category ? args?.category?.model?.id : args?.tag?.id
        const levelThreeTagSlug = args?.category ? args?.category?.model?.slug : args?.tag?.slug
        tagStore.saveLevelThreeTag({ levelThreeTagId, levelThreeTagSlug });

        // set level four 
        const levelFourTagId = args?.category ? args?.category?.level_four_tag?.id : args?.tag?.level_four_tag ? args?.tag?.level_four_tag?.id : null
        const levelFourTagSlug = args?.category ? args?.category.level_four_tag?.slug : args?.tag?.level_four_tag ? args?.tag?.level_four_tag?.slug : null
        if (levelFourTagId && levelFourTagSlug) {
            tagStore.saveLevelFourTag({ levelFourTagId, levelFourTagSlug });
        }
        if (args.tag?.level_four_tag || args.category) {
            if (args.category) {
                levelFourTagChange(args.category.level_four_tag)
            } else {
                levelFourTagChange(args.tag.level_four_tag)

            }
        } else {
            if (userStore.getOwner) {
                router.push({
                    name: 'owner-level-three',
                    params: {
                        name: userStore.getOwner.type === 'business' ? userStore.getOwner.slug : userStore.getOwner.name,
                        levelOneslug: levelOneSlug.value,
                        levelTwoslug: tagStore.getLevelTwoTagSlug,
                        levelThreeslug: args.tag.slug,
                    }
                })
            } else {
                router.push({
                    name: 'level-three-page',
                    params: {
                        levelOneslug: levelOneSlug.value,
                        levelTwoslug: tagStore.getLevelTwoTagSlug,
                        levelThreeslug: args.tag.slug,
                    }
                })
            }
        }
        // call apis
        if (args.category) {
            levelThreeTag.value = await levelThreeTags(tagStore.getLevelOneTagId, tagStore.getLevelTwoTagId, { limit: 20, 'level-four-count': true })
        }
        levelFourTag.value = await levelFourTags(tagStore.getLevelOneTagId, tagStore.getLevelTwoTagId, tagStore.getLevelThreeTagId, { limit: 20, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : '' }, false)
    })

    // owner leveltwo redirection
    eventBus.on('levelTwo', async (args) => {
        levelTwoTagChange(args.tag)
    })

    //redirect to level three when click on regions
    eventBus.on('regions', async (args) => {
        const levelTwoTagId = args.levelTwoTag.id;
        const levelTwoTagSlug = args.levelTwoTag.slug;
        levelThreeTag.value = [];
        levelFourTag.value = [];
        tagStore.removeLevelThreeTag()
        tagStore.removeLevelFourTag()
        tagStore.saveLevelTwoTag({ levelTwoTagId, levelTwoTagSlug });
        levelThreeTag.value = await levelThreeTags(tagStore.getLevelOneTagId, tagStore.getLevelTwoTagId, { limit: 20, 'level-four-count': true })
        await levelThreeTagChange(args.tag)
    })

    window.addEventListener('resize', updateScreenWidth);
});

const checkLevelOne = async () => {
    if (route.params.levelOneslug) {
        let filteredData = tagStore.getLevelOneTags.find(level => level.slug === route.params.levelOneslug);
        // tagStore.removeLevelOneTag()
        if (filteredData) {
            tagStore.removeLevelTwoTag();
            tagStore.removeLevelThreeTag();
            tagStore.removeLevelFourTag();
            tagStore.removeTags()
            const levelOneTagId = filteredData ? filteredData.id : null;
            const levelOneTagSlug = filteredData ? filteredData.slug : null;
            tagStore.saveLevelOneTag({ levelOneTagId, levelOneTagSlug });
            levelOne.value ? levelTwoTag.value = await levelTwoTags(tagStore.getLevelOneTagId, { limit: 20, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : null }, false) : null;
            checkLevelTwo();
        } else {
            router.push({ name: 'not-found' });
        }
    } else {
        userStore.removeOwner()
        // tagStore.removeLevelOneTag()
    }

}

const checkLevelTwo = async () => {
    if (route.params.levelTwoslug) {
        let filteredData = levelTwoTag.value.find(level => level.slug === route.params.levelTwoslug);
        if (filteredData) {
            tagStore.removeLevelThreeTag();
            tagStore.removeLevelFourTag();
            const levelTwoTagId = filteredData ? filteredData.id : null;
            const levelTwoTagSlug = filteredData ? filteredData.slug : null;
            tagStore.saveLevelTwoTag({ levelTwoTagId, levelTwoTagSlug });
            levelOne.value && levelTwo.value ? levelThreeTag.value = await levelThreeTags(tagStore.getLevelOneTagId, levelTwo.value, { limit: 20, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : null, 'level-four-count': true }) : null;
            checkLevelThree();
        } else {
            router.push({ name: 'not-found' });
            tagStore.removeLevelTwoTag();
            tagStore.removeLevelThreeTag();
            tagStore.removeLevelFourTag();
        }
    }
}

const checkLevelThree = async () => {
    if (route.params.levelThreeslug) {
        let filteredData = levelThreeTag.value.find(level => level.slug === route.params.levelThreeslug);

        if (filteredData) {
            tagStore.removeLevelThreeTag();
            tagStore.removeLevelFourTag();
            const levelThreeTagId = filteredData ? filteredData.id : null;
            const levelThreeTagSlug = filteredData ? filteredData.slug : null;
            tagStore.saveLevelThreeTag({ levelThreeTagId, levelThreeTagSlug });
            levelOne.value && levelTwo.value && levelThree.value ? levelFourTag.value = await levelFourTags(tagStore.getLevelOneTagId, levelTwo.value, levelThree.value, { limit: 20, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner ? userStore.getOwner.id : null }, false) : null;
            checkLevelFour();
        } else {
            router.push({ name: 'not-found' });
            tagStore.removeLevelThreeTag();
            tagStore.removeLevelFourTag();
        }
    }
}

const checkLevelFour = async () => {
    if (route.params.levelFourslug) {
        let filteredData = levelFourTag.value.find(level => level.slug === route.params.levelFourslug);
        if (filteredData) {
            tagStore.removeLevelFourTag();
            const levelFourTagId = filteredData ? filteredData.id : null;
            const levelFourTagSlug = filteredData ? filteredData.slug : null;
            tagStore.saveLevelFourTag({ levelFourTagId, levelFourTagSlug });
        } else {
            router.push({ name: 'not-found' });
            tagStore.removeLevelFourTag();
        }
    }
}

onBeforeMount(async () => {
    if (route?.name === 'owner-level-one') {
        tagStore.removeLevelTwoTag()
        tagStore.removeLevelThreeTag()
        tagStore.removeLevelFourTag()
    }

    // check levels if refresh page or change url
    checkLevelOne();
})

onBeforeUnmount(async () => {
    window.removeEventListener('resize', updateScreenWidth);
    eventBus.off('levelFour')
});

</script>

<template>
    <div class="col-md-12 mb-4">
        <div class="p-3 shadow rounded bg-white">
            <div class="row mb-2">
                <div class="col-md-3 col-sm-12 my-3">
                    <Select2 v-model="levelOne" :options="levelOneOptions" @select="levelOneTagCahnge"
                        placeholder="Select Level One" :class="[levelOne ? 'active' : '']" />
                </div>
                <div class="col-md-3 col-sm-12 my-3">
                    <Select2 v-model="levelTwo" :options="levelTwoTag" @select="levelTwoTagChange"
                        placeholder="Select Level Two" :class="[tagStore.getLevelTwoTagId ? 'active' : '']"></Select2>
                </div>
                <div class="col-md-3 col-sm-12 my-3">
                    <Select2 v-model="levelThree" :options="levelThreeTag" placeholder="Select Level Three"
                        @select="levelThreeTagChange" :class="[tagStore.getLevelThreeTagId ? 'active' : '']"></Select2>
                </div>
                <div class="col-md-3 col-sm-12 my-3">
                    <Select2 v-model="levelFour" :options="levelFourTag" placeholder="Select Level Four"
                        @select="levelFourTagChange" :class="[tagStore.getLevelFourTagId ? 'active' : '']"></Select2>
                </div>
                <!-- Slider section -->
                <div class="d-flex tags-group">
                    <v-sheet class="mx-auto" style="width: 100%;">
                        <v-slide-group show-arrows ref="slideGroup">
                            <template v-slot:prev="{ prev, prevIndex }" class="d-none">
                                <template v-if="prev">
                                    <BackButtonSvg @click="goToSlide(prevIndex)" />
                                </template>
                            </template>
                            <v-slide-group-item v-for="tag in tags" :key="tag.id">
                                <Button @click="handleTagsClick(tag)" :class="activeTag(tag) ? 'activeTab' : ''"
                                    class="tag-node">
                                    {{ tag.name }}
                                </Button>
                            </v-slide-group-item>

                            <template v-slot:next="{ next, nextIndex }">
                                <template v-if="next">
                                    <SliderSvg @click="goToSlide(nextIndex)" />
                                </template>
                            </template>
                        </v-slide-group>
                    </v-sheet>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';

::v-deep .v-btn__overlay {
    background-color: transparent !important;
}

::v-deep .v-btn__content {
    background-color: transparent !important;
}

::v-deep.v-slide-group__content {
    margin-bottom: 2px !important;
}

:deep(.v-slide-group__container) {
    margin-bottom: 2px !important;
}

::v-deep .select2-container {
    margin: 0;
    width: 100% !important;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-sizing: border-box;
}

:deep(.v-slide-group__next--disabled),
:deep(.v-slide-group__prev--disabled) {
    pointer-events: none !important;
    opacity: var(--v-disabled-opacity) !important;
    display: none !important;
}

:deep(.v-slide-group__next--disabled),
:deep(.v-slide-group__prev--disabled) {
    pointer-events: none !important;
    opacity: var(--v-disabled-opacity) !important;
    display: none !important;
}

:deep(.v-slide-group__prev) {

    margin-bottom: -1px;
}

:deep(.v-slide-group__next) {
    margin-bottom: -1px;


}

.v-btn--variant-elevated {
    box-shadow: none !important;
    background-color: #fff !important;
    border: 1px solid #aaa !important;
    border-radius: 4px !important;
    gap: 10;
}

::v-deep .select2-container--default .select2-selection--single .select2-selection__arrow b {
    margin-top: 3px;
}

::v-deep .select2-container .select2-selection--single {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 50px;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 6px;
    color: #676767;
    height: calc(1.53em + 0.875rem + 2px);

}

::v-deep .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 2.25rem;
    color: #697a8d;
    padding-left: 0.875rem;
}

.select2-container--default .select2-selection--single .select2-selection__arrow b {
    position: absolute;
    height: 12px;
    width: 17px;
    top: 40%;
    background-repeat: no-repeat;
    background-size: 17px 12px;
}

::v-deep .active .select2-container .select2-selection--single {
    border-color: #ff6846;
}

::v-deep .active .select2-container--default .select2-selection--single .select2-selection__rendered {
    color: #ff6846;
}

::v-deep .active .select2-container--default .select2-selection--single .select2-selection__arrow b {
    border-color: #ff6846 transparent transparent transparent;
}

.btn-primary {
    color: #697a8d !important;
    background-color: transparent !important;
    border-color: #999 !important;
    box-shadow: none !important;
    /* Set box-shadow to 'none' to remove it */
}

.btn-primary:hover {
    color: #697a8d !important;
    background-color: transparent !important;
    border-color: #999 !important;
    box-shadow: none !important;
    transform: translateY(0px) !important;
}

.tag-node:not(:first-child) {
    margin-left: 1rem;
}
</style>