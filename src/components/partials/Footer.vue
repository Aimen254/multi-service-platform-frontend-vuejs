<script setup>
import MainLogo from '@/assets/images/logos/LocalverseWhite.vue'
import IconFacebook from '@/components/icons/IconFacebook.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'
import IconYoutube from '@/components/icons/IconYoutube.vue'
import IconInstagram from '@/components/icons/IconInstagram.vue'
import IconPinterest from '@/components/icons/IconPinterest.vue'
</script>
<template>
    <div class="footer bg-secondary">
        <div class="container-fluid container-p-x pt-5 pb-4">
            <div class="row">
                <div class="col-12 col-md-4 mb-4 mb-sm-0">
                    <div class="logo mb-4">
                        <MainLogo class="img" />
                    </div>
                    <div class="subscribe pb-3">
                        <form>
                            <div class="d-flex">
                                <input type="text" class="form-control" id="defaultFormControlInput"
                                    placeholder="Your email address" aria-describedby="defaultFormControlHelp" />
                                <button type="button" class="btn btn-primary text-uppercase ms-4">Subscribe</button>
                            </div>
                        </form>
                    </div>
                    <div class="social-icon my-3">
                        <a href="javascript:void(0)" class="btn btn-icon btn-sm me-2">
                            <IconFacebook />
                        </a>
                        <a href="javascript:void(0)" class="btn btn-icon btn-sm me-2">
                            <IconTwitter />
                        </a>
                        <a href="javascript:void(0)" class="btn btn-icon btn-sm me-2">
                            <IconYoutube />
                        </a>
                        <a href="javascript:void(0)" class="btn btn-icon btn-sm me-2">
                            <IconInstagram />
                        </a>
                        <a href="javascript:void(0)" class="btn btn-icon btn-sm me-2">
                            <IconPinterest />
                        </a>
                    </div>
                    <!-- <p class="pt-4">2023 &copy; Localverse</p> -->
                </div>
                <div class="row col-md-8 col-12 info-list">
                    <div class="col-12 col-md-6 col-lg-4 mb-4 mb-md-0">
                        <h5 class="text-uppercase">Company</h5>
                        <ul class="list-unstyled">
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">About Us</a></li>
                            <li>
                                <a href="javascript:void(0)" class="footer-link d-block pb-2">Privacy Policy</a>
                            </li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Cookies Policy</a></li>
                        </ul>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4 mb-4 mb-sm-0">
                        <h5 class="text-uppercase">My Account</h5>
                        <ul class="list-unstyled">
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Track My Order</a></li>
                            <li>
                                <a href="javascript:void(0)" class="footer-link d-block pb-2">View Cart</a>
                            </li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Sign In</a></li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">My Wishlist</a></li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Order History</a></li>
                        </ul>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <h5 class="text-uppercase">Customer Service</h5>
                        <ul class="list-unstyled">
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Contact Us</a></li>
                            <li>
                                <a href="javascript:void(0)" class="footer-link d-block pb-2">Payment Methods</a>
                            </li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Product Returns</a></li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Terms &amp; Conditions</a>
                            </li>
                            <li><a href="javascript:void(0)" class="footer-link d-block pb-2">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="content-backdrop fade"></div>
</template>