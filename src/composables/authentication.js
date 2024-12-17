import { ref, inject } from "vue"
import { useUserStore } from "@stores/user"
import { useRouter } from "vue-router"
import { useHelper } from "./helper"
import { useToastr } from "./toastr"
import { useTagStore } from '@stores/tags'

export const useAuthApi = () => {
  const userStore = useUserStore();
  const $http = inject("$http");
  const router = useRouter();
  const { confirm } = useToastr();
  // extracting helper functions
  const { inValidToken, showLoading, hideLoading, } = useHelper();

  const tagStore = useTagStore()

  const errors = ref("");

  const login = async (data) => {
    const userAgent = window.navigator.userAgent;
    let deviceType = "";

    if (/Mobile|Tablet/i.test(userAgent)) {
      deviceType = "Mobile or Tablet";
    } else {
      deviceType = "Desktop";
    }
    const deviceName = userAgent.match(/\((.*?)\)/)[1];

    try {
      showLoading();
      const response = await $http.post("/api/signin", data, {
        headers: {
          "Device-Token": 13131713,
          "Device-Type": deviceType,
          "Device-Name": deviceName,
          "Accept-Language": "en",
          "Send-Notification": 1,
        },
      });
      errors.value = "";
      storeUserData(response.data.data);
      hideLoading();
      localStorage.setItem("menu-collapsed", "true");
      router.push("/");
      return response.data;
    } catch (e) {
      hideLoading();
      errors.value = e.response
        ? e.response.data.message
        : "An error occurred.";
    }
  };

  const signup = async (data) => {
    const userAgent = window.navigator.userAgent;
    let deviceType = "";

    // Check if the user agent string contains "Mobile" or "Tablet"
    if (/Mobile|Tablet/i.test(userAgent)) {
      deviceType = "Mobile or Tablet";
    } else {
      deviceType = "Desktop";
    }
    // Get the device name from the user agent string
    const deviceName = userAgent.match(/\((.*?)\)/)[1];

    try {
      showLoading();
      const response = await $http.post("/api/signup", data, {
        headers: {
          "Device-Token": 13131713,
          "Device-Type": deviceType,
          "Device-Name": deviceName,
          "Accept-Language": "en",
          "Send-Notification": 1,
        },
      });
      errors.value = "";
      storeUserData(response.data.data);
      hideLoading();
      localStorage.setItem("menu-collapsed", "true");
      router.push("/");
      return response.data.data;
    } catch (e) {
      hideLoading();
      errors.value = e.response
        ? e.response.data.message
        : "An error occurred.";
    }
  };

  async function logout() {
    const result = await confirm('You want to logout?', 'Yes, Logout!');
    if (result.isConfirmed || adminLocked) {
      showLoading();
      $http
        .post("/api/logout")
        .then((response) => {
          userStore.unSet();
          userStore.removeOwner()
          tagStore.removeLevelOneTag()
          tagStore.removeLevelTwoTag()
          tagStore.removeLevelThreeTag()
          tagStore.removeLevelFourTag()
          localStorage.removeItem('menu-collapsed')
          localStorage.removeItem('levelOneTags')
          router.push('/login');
          hideLoading();
        })
        .catch((exception) => {
          hideLoading();
          errors.value = exception?.response?.data?.message;
          inValidToken(exception?.response?.data?.message);
        });
    }
  }

  function storeUserData(user) {
    userStore.setUser(user);

  }

  return {
    errors,
    login,
    signup,
    logout
  };
};
