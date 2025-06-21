<!-- <template>
    <div class="page" @click="closeDialog" :class="{fullscreen: isFullscreen}">
        <div ref="pageHeader">
            <page-header type="zhejiang"></page-header>
        </div>
        <div class="page-container" ref="pageContainer">
            <div class="map">
                <div class="map-wrapper">
                    <map-core ref="map" :region="region" :mapData="mapData" :huzhouMapJson="huzhouMapJson"
                              @mapClick="mapClick"></map-core>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pageHeader from '@/components/header'
import pageTitle from '@/components/title'
import Left from '@/components/left'
import Right from '@/components/right'
import projectList from './subs/projectList'
import statistic from './subs/statistic'
import application from './subs/application'
import news from './subs/news'
import mapCore from './subs/map/zhejiang'
import service from '@/api'
import screenfull from "screenfull";
import dsDialog from './subs/dialog'
import mapJson from '../../assets/json/zhejiang.json'

export default {
    components: {
        pageHeader,
        pageTitle,
        projectList,
        statistic,
        application,
        news,
        mapCore,
        Left,
        Right,
        dsDialog
    },
    data() {
        return {
            projectList: [],
            applicationList: [
                {name: '应用', value: '724563', percent: 17.2},
                {name: '应用', value: '724563', percent: 17.2},
                {name: '应用', value: '724563', percent: 17.2},
            ],
            newsList: [],
            openLeft: true,
            openRight: true,
            isFullscreen: false,
            year: 2023,
            statisticData: [],
            // 项目区域
            region: '浙江省湖州市',
            huzhouMapJson: mapJson,
            mapData: [],
            showDialog: false
        }
    },
    computed: {
        totalValue() {
            return this.a.reduce((pre, cur, index) => {
                return pre + cur.value
            }, 0)
        }
    },
    mounted() {
        window.addEventListener('resize', this.judgeCurrentScreen)
        // this.getMapGeoJson();
        this.$nextTick(() => {
          this.$refs.map.initHZMap()
        })
        // this.init()
    },
    methods: {
        init() {
            this.getData();
            this.getProjectList();
            this.getNewsList();
        },
        mapClick(params) {
            switch (params.seriesType) {
                case 'map':
                    this.region = params.name;
                    if (this.region === '湖州市' || this.region === '浙江省湖州市') {
                        if(this.region === '湖州市') {
                            this.region = '浙江省湖州市'
                        }
                        this.$router.push({
                            path: '/home/detail',
                            query: {
                                region: this.region
                            }
                        })
                    }
                    break;
                case 'custom':
                    if(params.data.property) {
                        // 地块点击
                        this.showDialog = true;
                    } else {
                        // 柱子点击
                        if(params.name) {
                            this.region = params.name
                        } else {
                            this.region = `浙江省湖州市${params.data[2].name}`
                        }
                        this.init()
                    }
                    break;
                case 'scatter':
                    // 柱子点击
                    if(params.name) {
                        this.region = params.name
                    } else {
                        this.region = `浙江省湖州市${params.data[2].name}`
                    }
                    this.init()
                    break;

            }
        },
        // 项目列表
        async getProjectList() {
            const res = await service('post', 'project/map/list', {
                region: this.region
            })
            if (res.status === 200) {
                this.projectList = res.data
            }
        },
        // 新闻列表
        async getNewsList() {
            const res = await service('get', 'news/list', {
                region: this.region
            })
            if (res.status === 200) {
                this.newsList = res.data
            }
        },
        // 基于行政区划的项目统计
        async getData(region, cb) {
            const res = await service('get', 'project/map/region/stat', {
                year: this.year,
                parent: region ? region : this.region
            })
            if (res.status === 200) {
                if (cb) {
                    cb(res)
                } else {
                    this.statisticData = res.data
                    this.$nextTick(() => {
                        this.$refs.statistic.initEcharts();
                    })
                }
            }
        },
        // 获取地图geo
        async getMapGeoJson() {
            const parent = '浙江省'
            await this.getData(parent, (res) => {
                this.mapData = res.data
            })
            const res = await service('get', '/project/map/geojson', {
                region: parent
            })
            if (res.status === 200) {
                if (res.data) {
                    this.huzhouMapJson = JSON.parse(res.data)
                }
                this.$nextTick(() => {
                    this.$refs.map.initHZMap()
                })
            }
        },
        changeYear(year) {
            this.year = year
            this.getData()
        },
        closeDialog(e) {

        },
        openDialog(item) {

        },
        changeStageHandler() {

        },
        async getList() {

        },
        toggleLeftHandler() {
            this.openLeft = !this.openLeft;
        },
        toggleRightHandler() {
            this.openRight = !this.openRight;
        },
        changeFull(state) {
            this.isFullscreen = state
        },
        // 判断当前的屏幕是否为全屏状态
        judgeCurrentScreen() {
            // 非全屏状态
            if (!this.checkFull()) {
                this.changeFull(false);
            }
            // 全屏状态
            if (this.checkFull()) {
                this.changeFull(true);
            }
        },
        fullscreen() {
            screenfull.toggle();
        },
        checkFull() {
            //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
            //火狐浏览器
            var isFull = document.mozFullScreen ||
                document.fullScreen ||
                //谷歌浏览器及Webkit内核浏览器
                document.webkitIsFullScreen ||
                document.webkitRequestFullScreen ||
                document.mozRequestFullScreen ||
                document.msFullscreenEnabled
            if (isFull === undefined) {
                isFull = false
            }
            return isFull;
        },
        changeScreen() {
            this.fullscreen();
            this.changeFull(!this.screen);
        },
    }
}
</script>

<style lang="less" scoped>
.page {
    background-image: url("../../assets/images/common/bg-zhejiang.png");
    background-repeat: repeat;
    background-position: 0 0;
    background-size: cover;
    min-height: 100vh;

    &.fullscreen {
        .map-wrapper {
            min-height: calc(~"100vh - 100px");
        }
    }

    &-container {
        //padding: 20px 30px 20px 40px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        &__section {
            width: 509px;
            height: inherit;
            background-size: 100% 100%;
            background-image: url("../../assets/images/common/section.png");
            background-repeat: repeat;
            background-position: 0 0;
            position: relative;
            margin-top: 25px;

            &:after {
                content: "";
                width: 509px;
                height: 3px;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background-image: url("../../assets/images/common/section-line.png");
                background-repeat: repeat;
                background-position: center 0;
                background-size: 100% 100%;
            }
        }

        .map {
            margin: 0 auto;

            &-logo {
                width: 148px;
                height: 134px;
                position: absolute;
                top: 0;
                right: -168px;

                img {
                    width: inherit;
                    height: inherit;
                }
            }

            &-wrapper {
                width: 100vw;
                min-height: calc(~"100vh - 100px");
                position: relative;
                margin: 0 auto;
            }
        }
    }
}

.fullscreen-btn {
    position: absolute;
    left: -90px;
    top: 15px;
    cursor: pointer;

    img {
        width: 49px;
        height: 48px;
    }
}
</style> -->
