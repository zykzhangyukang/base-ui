<template>
  <div class="header-bar clear-fix">
    <FoldSideMenu />
    <BreadCrumbs />
    <div class="header-right clear-fix">
      <UserAvatar />
    </div>
  </div>
</template>

<script>
import FoldSideMenu from '@/components/FoldSideMenu'
import BreadCrumbs from '@/components/BreadCrumbs'
import UserAvatar from '@/components/UserAvatar'

export default {
  components: {
    FoldSideMenu,
    BreadCrumbs,
    UserAvatar
  }
}
</script>

<style lang="less">
  .header-bar {
    height: 32px;
    padding: 16px 20px;
    .header-right {
      float: right;
      width: 80px;
    }
  }
</style>
