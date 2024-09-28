<template>
  <div class="header-bar clear-fix">
    <FoldSideMenu />
    <BreadCrumbs />
    <div class="header-right clear-fix">
      <Notification/>
      <UserAvatar />
    </div>
  </div>
</template>

<script>
import FoldSideMenu from '@/components/FoldSideMenu'
import BreadCrumbs from '@/components/BreadCrumbs'
import UserAvatar from '@/components/UserAvatar'
import Notification from "@/components/Notification/index.vue";

export default {
  components: {
    FoldSideMenu,
    BreadCrumbs,
    UserAvatar,
    Notification
  }
}
</script>

<style lang="less">
.header-bar {
  height: 32px;
  padding: 16px 20px;
  .header-right {
    float: right;
    width: 110px;
  }
}
</style>
