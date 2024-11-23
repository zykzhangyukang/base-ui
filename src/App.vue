<template>
    <div id="app">
        <notice-new-version :pollingTime="pollingTime"></notice-new-version>
        <router-view/>
    </div>
</template>

<script>
    import NoticeNewVersion from "@/components/Notification/NoticeNewVersion.vue";
    export default {
        name: 'App',
        components: { NoticeNewVersion },
        data() {
            return {
                pollingTime: 1000 * 60 * 30,
            };
        },
    }
</script>

<style lang="less">
    @import "assets/less/index.less";
    @import "assets/less/reset";
</style>
