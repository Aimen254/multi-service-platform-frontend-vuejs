<script setup>
import img from '@assets/images/1.png';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isChatContactsVisible = ref(window.innerWidth < 1200);

const toggleChatContacts = () => {
  isChatContactsVisible.value = !isChatContactsVisible.value;
};

const handleResize = () => {
  if (window.innerWidth >= 1200){
    isChatContactsVisible.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="app-chat overflow-hidden card">
    <div class="row g-0">

      <!-- Chat & Contacts -->
      <div
          class="col app-chat-contacts app-sidebar flex-grow-0 overflow-auto border-end bg-white"
          :class="{ 'show': isChatContactsVisible }"
          id="app-chat-contacts" style="scrollbar-width: thin">
        <div class="sidebar-header px-3 mx-1">
          <i
              class="bx bx-x cursor-pointer position-absolute top-0 end-0 mt-2 me-1 fs-4 d-lg-none d-block"
              data-overlay
              data-bs-toggle="sidebar"
              data-target="#app-chat-contacts"
              @click="toggleChatContacts"
          ></i>
        </div>
        <div class="sidebar-body">
          <!-- Chats -->
          <ul class="list-unstyled chat-contact-list pt-1" id="chat-list">
            <li class="chat-contact-list-item chat-contact-list-item-title">
              <h5 class="text-primary mb-0">Today</h5>
            </li>
            <li class="chat-contact-list-item chat-list-item-0 d-none">
              <h6 class="text-dark mb-0">No Chats Found</h6>
            </li>
            <li class="chat-contact-list-item active">
              <a class="d-flex align-items-center">
                <div class="flex-shrink-0 avatar avatar-offline">
                  <img :src="img" alt="Avatar" class="rounded-circle" />
                </div>
                <div class="chat-contact-info flex-grow-1 ms-3 ">
                  <h6 class="chat-contact-name text-truncate m-0 text-white">Felecia Rower</h6>
                  <p class="chat-contact-status text-truncate mb-0 text-white">
                    I will purchase it for sure. 👍
                  </p>
                </div>
                <small class="text-white mb-auto">5 min</small>
              </a>
            </li>
            <li class="chat-contact-list-item chat-contact-list-item-title">
              <h5 class="text-primary mb-0">Last Week</h5>
            </li>
            <li v-for="index in 6" :key="index" class="chat-contact-list-item">
              <a class="d-flex align-items-center">
                <div class="flex-shrink-0 avatar avatar-online">
                  <img :src="img" alt="Avatar" class="rounded-circle" />
                </div>
                <div class="chat-contact-info flex-grow-1 ms-3">
                  <h6 class="chat-contact-name text-truncate m-0 text-black">Waldemar</h6>
                  <p class="chat-contact-status text-truncate mb-0 text-muted">
                    Refer friends. Get rewards.
                  </p>
                </div>
                <small class="text-black mb-auto">3 days</small>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- /Chat contacts -->

      <!-- Chat History -->
      <div class="col app-chat-history" style="background-color: #f1f2f3 !important;">
        <div class="chat-history-wrapper">
          <div class="chat-history-header border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex overflow-hidden align-items-center">
                <i
                    class="bx bx-menu bx-sm cursor-pointer d-lg-none d-block me-2"
                    data-bs-toggle="sidebar"
                    data-overlay
                    data-target="#app-chat-contacts"
                    @click="toggleChatContacts"
                ></i>
                <div class="flex-shrink-0 avatar">
                  <img
                      :src="img"
                      alt="Avatar"
                      class="rounded-circle"
                      data-bs-toggle="sidebar"
                  />
                </div>
                <div class="chat-contact-info flex-grow-1 ms-3">
                  <h6 class="m-0 text-dark">Felecia Rower</h6>
                  <small class="user-status text-muted">NextJS developer</small>
                </div>
              </div>
            </div>
          </div>
          <div class="chat-history-body overflow-auto" style="scrollbar-width: thin;">
            <ul class="list-unstyled chat-history mb-0">
              <li class="chat-message chat-message-right">
                <div class="d-flex overflow-hidden">
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text">
                      <p class="mb-0 text-white">How can we help? We're here for you! 😄</p>
                    </div>
                    <div class="text-end text-muted mt-1">
                      <i class="bx bx-check-double text-success"></i>
                      <small>10:00 AM</small>
                    </div>
                  </div>
                  <div class="user-avatar flex-shrink-0 ms-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message">
                <div class="d-flex overflow-hidden">
                  <div class="user-avatar flex-shrink-0 me-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text bg-white">
                      <p class="mb-0">Hey John, I am looking for the best admin template.</p>
                      <p class="mb-0">Could you please help me to find it out? 🤔</p>
                    </div>
                    <div class="text-muted mt-1">
                      <small>10:02 AM</small>
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message chat-message-right">
                <div class="d-flex overflow-hidden">
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text">
                      <p class="mb-0 text-white">Sneat has all the components you'll ever need in a app.</p>
                    </div>
                    <div class="text-end text-muted mt-1">
                      <i class="bx bx-check-double text-success"></i>
                      <small>10:03 AM</small>
                    </div>
                  </div>
                  <div class="user-avatar flex-shrink-0 ms-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message">
                <div class="d-flex overflow-hidden">
                  <div class="user-avatar flex-shrink-0 me-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text bg-white">
                      <p class="mb-0">Looks clean and fresh UI. 😃</p>
                    </div>
                    <div class="text-muted mt-1">
                      <small>10:05 AM</small>
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message chat-message-right">
                <div class="d-flex overflow-hidden">
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text">
                      <p class="mb-0 text-white">Thanks, you can purchase it.</p>
                    </div>
                    <div class="text-end text-muted mt-1">
                      <i class="bx bx-check-double text-success"></i>
                      <small>10:06 AM</small>
                    </div>
                  </div>
                  <div class="user-avatar flex-shrink-0 ms-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message">
                <div class="d-flex overflow-hidden">
                  <div class="user-avatar flex-shrink-0 me-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text bg-white">
                      <p class="mb-0">I will purchase it for sure. 👍</p>
                    </div>
                    <div class="text-muted mt-1">
                      <small>10:08 AM</small>
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message chat-message-right">
                <div class="d-flex overflow-hidden">
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text">
                      <p class="mb-0 text-white">Great, Feel free to get in touch.</p>
                    </div>
                    <div class="text-end text-muted mt-1">
                      <i class="bx bx-check-double text-success"></i>
                      <small>10:10 AM</small>
                    </div>
                  </div>
                  <div class="user-avatar flex-shrink-0 ms-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message">
                <div class="d-flex overflow-hidden">
                  <div class="user-avatar flex-shrink-0 me-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                  <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text bg-white">
                      <p class="mb-0">Do you have design files for Sneat</p>
                    </div>
                    <div class="text-muted mt-1">
                      <small>10:15 AM</small>
                    </div>
                  </div>
                </div>
              </li>
              <li class="chat-message chat-message-right">
                <div class="d-flex overflow-hidden">
                  <div class="chat-message-wrapper flex-grow-1 w-50">
                    <div class="chat-message-text">
                      <p class="mb-0 text-white">
                        Yes that's correct documentation file, Design files are included with the template.
                      </p>
                    </div>
                    <div class="text-end text-muted mt-1">
                      <i class="bx bx-check-double"></i>
                      <small>10:15 AM</small>
                    </div>
                  </div>
                  <div class="user-avatar flex-shrink-0 ms-3">
                    <div class="avatar avatar-sm">
                      <img :src="img" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="chat-history-footer border" style="background-color: #ffffff !important;">
            <form class="form-send-message d-flex justify-content-between align-items-center">
              <input
                  class="form-control message-input border-0 me-3 shadow-none"
                  placeholder="Type your message here..."
              />
              <div class="message-actions d-flex align-items-center">
                <button class="btn btn-primary d-flex send-msg-btn">
                  <span class="align-middle">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- /Chat History -->

      <div class="app-overlay" :class="{ 'show': isChatContactsVisible }"></div>
    </div>
  </div>
</template>
