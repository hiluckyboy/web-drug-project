<template>
    <div class="border">
        <div class="head" ref="scrollContainer" @wheel.prevent="handleScroll">
            <div ref="scrollWrapper" :style="{left: left + 'px'}" class="list">
                <router-link ref="tag" @contextmenu.prevent.native="openMenu(tag,$event)" class="item" tag="div"
                             :key="tag.path" :to="tag" v-bind:class="fullpath==tag.path?'active':''"
                             v-for="tag in this.visitedViews">{{getTitle(tag)}}
                    <span class="el-icon-close" v-bind:class="fullpath!=tag.path?'stop':''"
                          @click.privent="closeSelectedTag(tag,true,$event)"></span>
                </router-link>
            </div>
        </div>
        <ul class='contextmenu' v-show="visible" :style="{left:mleft+'px',top:mtop+'px'}">
            <li @click="closeSelectedTag(selectedTag,false)">关闭</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags">关闭所有</li>
        </ul>
    </div>
</template>

<script>
    const padding = 0;
    export default {
        name: "tabView",
        data() {
            return {
                mleft: 0,
                mtop: 0,
                left: 0,
                selectedTag: {},
                visible: false
            };
        },
        methods: {
            itemClick(e) {
                let dom = e.target;
            },
            addVisitedView(tag) {
                this.$store.dispatch('addVisitedViews', tag);
            },
            delVisitedView(tag) {
                this.$store.dispatch('delVisitedViews', tag).then((tags) => {
                    if (tag.path == this.$route.path) {
                        if (tags.length > 0) {
                            this.$router.push({path: tags[tags.length - 1].path});
                        } else {
                            this.$router.push({path: '/home'});
                        }
                    }
                });
            },
            moveToCurrentTag() {
                const tags = this.$refs.tag
                this.$nextTick(() => {
                    for (const tag of tags) {
                        if (tag.to.path === this.$route.path) {
                            this.$refs.scrollPane.moveToTarget(tag.$el)
                            break
                        }
                    }
                })
            },
            closeSelectedTag(view, flag, event) {
                if (flag) {
                    let dom = event.target;
                    console.log(dom.className);
                    if (dom.className.indexOf('stop') >= 0)
                        return;
                }
                this.$store.dispatch('delVisitedViews', view).then((views) => {
                    if (view.path == this.$route.fullPath) {
                        const latestView = views.slice(-1)[0]
                        if (latestView) {
                            this.$router.push(latestView)
                        } else {
                            this.$router.push('/')
                        }
                    }
                })
                event.stopPropagation();
            },
            closeOthersTags() {
                this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
                    this.$router.push(this.selectedTag);
                });

            },
            closeAllTags() {
                this.$store.dispatch('delAllViews').then((res) => {
                    this.$router.push('/')
                })
            },
            openMenu(tag, e) {
                this.visible = true
                this.selectedTag = tag
                const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
                this.mleft = e.clientX - offsetLeft + 190 // 15: margin right
                this.mtop = e.clientY - 35
            },
            closeMenu() {
                this.visible = false
            },
            handleScroll(e) {
                const eventDelta = e.wheelDelta || -e.deltaY * 3
                const $container = this.$refs.scrollContainer
                const $containerWidth = $container.offsetWidth
                const $wrapper = this.$refs.scrollWrapper
                const $wrapperWidth = $wrapper.offsetWidth

                if (eventDelta > 0) {
                    this.left = Math.min(0, this.left + eventDelta)
                } else {
                    if ($containerWidth - padding < $wrapperWidth) {
                        if (this.left < -($wrapperWidth - $containerWidth + padding)) {
                            this.left = this.left
                        } else {
                            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
                        }
                    } else {
                        this.left = 0
                    }
                }
            },
            moveToTarget($target) {
                const $container = this.$refs.scrollContainer
                const $containerWidth = $container.offsetWidth
                const $targetLeft = $target.offsetLeft
                const $targetWidth = $target.offsetWidth

                if ($targetLeft < -this.left) {
                    // tag in the left
                    this.left = -$targetLeft + padding
                } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
                    // tag in the current view
                    // eslint-disable-line
                } else {
                    // tag in the right
                    this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
                }
            },
            getTitle(tag) {
                let routeName = tag.name;
                let title = "";
                if (routeName == 'home' || tag.path == '/home') {
                    return '首页';
                }
                if (!title) {
                    let route = tag;
                    let fullTitle = route.fullTitle;
                    if (route.title) {
                        title = route.title;
                    } else if (route.fullTitle) {
                        let titles = fullTitle.split("/");
                        title = titles[titles.length - 1];
                    }
                }
                return title;
            }
        },
        computed: {
            visitedViews() {
                return this.$store.state.tabView.visitedViews;
            },
            fullpath() {
                return this.$route.fullPath;
            }
        },
        watch: {
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        }

    }
</script>

<style scoped>
    .border {
        overflow-x: hidden;

    }

    .head {
        overflow-y: visible;
        background: #f5f7fa;
        padding: 0;
        border: 1px solid #dcdfe6;
        position: relative;
        margin: 0;
        height: 40px;
    }

    .list {
        white-space: nowrap;
        -webkit-transition: -webkit-transform .3s;
        transition: -webkit-transform .3s;
        transition: transform .3s, -webkit-transform .3s;
        float: left;
        position: relative;
        height: 40px;
        padding: 0px 5px;
    }

    .item:hover {
        color: #4FC3BA;
    }

    .item {
        webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 40px;
        display: inline-block;
        list-style: none;
        font-size: 14px;
        font-weight: 500;
        color: #909399;
        cursor: pointer;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 20px;
        padding-right: 6px;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        margin-right: -1px;
        margin-top: 1px;
        margin-bottom: -1px;

    }

    .active .el-icon-close:hover {
        background-color: #cf9236;
        border-radius: 50%;
        border-bottom: 1px solid #fff;
        margin-top: 1px;
        color: #fff;
    }

    .item .el-icon-close {
        width: 14px;
        height: 14px;
    }

    .item .el-icon-close:before {
        content: ' ';
    }

    .active {
        border-bottom: 1px solid #fff;
        background-color: #fff;
        color: #4FC3BA;
    }

    .active .el-icon-close:before {
        content: '\E60F';
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 100;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    }

    .contextmenu li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
    }

    .contextmenu li:hover {
        background: #eee;
    }

</style>
