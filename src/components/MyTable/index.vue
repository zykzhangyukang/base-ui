<template>
    <el-table ref="tableList" :data="data" :height="tableH" v-bind="$attrs" v-on="$listeners" size="mini">
        <slot></slot>
    </el-table>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                tableH: 0
            };
        },
        mounted() {
            this.resetTableHeight();
            window.addEventListener('resize', this.resetTableHeight);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.resetTableHeight);
        },
        methods: {
            resetTableHeight(){
                this.$nextTick(()=>{
                    let tableDom = this.$refs.tableList.$el;
                    let top  = tableDom.getBoundingClientRect().top;
                    let bottom = 100;
                    this.tableH = window.innerHeight - top -bottom;
                })
            }
        }
    };
</script>

<style scoped>

</style>
