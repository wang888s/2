<template>
    <div class="page" @click="closeDialog" :class="{ fullscreen: isFullscreen }">
        <!-- <div ref="pageHeader">
          <page-header></page-header>
        </div> -->

        <div class="page-container" ref="pageContainer">
            <Left :open="openLeft" @toggle="toggleLeftHandler">
                <!-- <div class="map-logo">
                  <img src="../../assets/images/common/map-logo.png" alt="" />
                </div> -->
                <div class="map-logo">
                    <back></back>
                </div>
                <section class="page-container__section">
                    <page-title>基础数据列表</page-title>
                    <project-list
                        :itemId="id"
                        :list="projectList"
                        @toggleParams="toggleBasicParamsHandler"
                        @open="openBasicHandle"
                        @close="closeBasicHandler"
                    ></project-list>
                </section>
                <section class="page-container__section">
                    <page-title>参数设置</page-title>
                    <param-settings
                        ref="paramsSetting"
                        :list="paramsList"
                        @toggleParams="toggleParamsHandler"
                    ></param-settings>
                </section>
            </Left>

            <div class="map">
                <div class="map-wrapper">
                    <map-core ref="map"
                              @drawEnd="dragendHandler"
                              :map-click="true"
                              :output-res="outputRes"
                              :is-customize-click-event="false"
                              @customizeClickEvent="customizeClickEventHandle"
                    ></map-core>
                </div>
            </div>

            <Right :open="openRight" @toggle="toggleRightHandler">
                <div class="opera">
                    <div class="opera-wrapper flex">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="多边形画框"
                            placement="top"
                        >
                            <div class="opera-icon draw" @click="draw"></div>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="矩形画框"
                            placement="top"
                        >
                            <div class="opera-icon draw-rect" @click="drawRect"></div>
                        </el-tooltip>
                        <!--            <div-->
                        <!--              class="opera-icon"-->
                        <!--              :class="{ play: !isPlay, stop: isPlay }"-->
                        <!--              @click="togglePlay"-->
                        <!--            ></div>-->
                    </div>
                    <div class="opera-wrapper">
                        <el-upload
                            class="upload-demo"
                            action="#"
                            :http-request="uploadHandle"
                            :show-file-list="false"
                            :file-list="fileList"
                        >
                            <div class="opera-btn primary">上传</div>
                        </el-upload>
                        <div
                            class="opera-btn primary"
                            v-show="!isCalculate"
                            @click="toggleCalculate"
                        >
                            自动核算
                        </div>
                        <div
                            class="opera-btn"
                            v-show="isCalculate"
                            @click="toggleCalculate"
                        >
                            取消计算
                        </div>
                        <!--                        <div class="opera-btn primary" @click="toggleParamsUpdate">调整参数</div>-->
                        <!--                        <div class="opera-wrapper__form" v-show="isParamsUpdate">-->
                        <!--                            <div class="form">-->
                        <!--                                <ds-form ref="dsForm"></ds-form>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                    </div>
                </div>
                <section class="page-container__section">
                    <page-title>历史核算结果</page-title>
                    <accounting-results-list
                        :itemId="id"
                        :list="accountingResultsList"
                        @detailClick="detailClickHandler"
                        @listClick="listClickHandler"
                    ></accounting-results-list>
                </section>
                <section class="page-container__section">
                    <page-title>技术文档</page-title>
                    <technology :list="technologyList"></technology>
                </section>
            </Right>
        </div>

        <hs-dialog
            :show="showHSDialog"
            :property="HSProperty"
            @close="showHSDialog = false"
        ></hs-dialog>
        <loading ref="loading" v-show="showLoading"></loading>
        <form-dialog
            ref="formDialog"
            v-show="showFormDialog"
            @close="showFormDialog = false"
            @submit="submitCalculate"
        ></form-dialog>
    </div>
</template>

<script>
import pageHeader from "@/components/header";
import pageTitle from "@/components/title";
import Left from "@/components/left";
import Right from "@/components/right";
import projectList from "./subs/projectList";
import accountingResultsList from "./subs/accountingResultsList";
import service from "@/api";
import screenfull from "screenfull";
import number from "./subs/number";
import dsForm from "@/components/business/ds-form";
import empty from "@/components/empty";
import back from "@/components/back";
import loading from "@/components/loading";
import mapCore from "../home/subs/map/map-calculate.vue";
import formDialog from "@/components/business/formDialog";
import technology from "./subs/technology";
import paramSettings from "./subs/paramSettings";
import hsDialog from "./subs/dialog";
import youyangJson from "../../assets/json/xzq(1).json";

export default {
    components: {
        pageHeader,
        pageTitle,
        projectList,
        Left,
        Right,
        accountingResultsList,
        number,
        dsForm,
        empty,
        back,
        loading,
        mapCore,
        formDialog,
        technology,
        paramSettings,
        hsDialog,
    },
    data() {
        return {
            fileList: [],
            projectList: [
                {
                    label: "酉阳县",
                    show: true,
                    list: [],
                },
            ],
            accountingResultsList: [
                // {name: '彰武镇民乐村大河口水库（月亮湖）', value: '724563', time: '2023-11-22'},
            ],
            technologyList: [],
            openLeft: true,
            openRight: true,
            isFullscreen: false,
            year: 2023,
            options: [],
            statisticData: [],
            huzhouMapJson: {},
            mapData: [],
            id: null,
            echartsData: {
                tiaojie_jz: 0,
                gongji_jz: 0,
            },
            isPlay: false,
            isCalculate: false,
            isParamsUpdate: false,
            showLoading: false,
            geometry: null,
            projectID: null,
            EPResult: {},
            echartsLoading: false,
            showFormDialog: false,
            yyUrl: 'http://120.26.15.133:8086/geoserver/yancheng/wms?service=WMS&version=1.1.0&request=GetMap&layers=yancheng%3Atif2&bbox=108.30484503862074%2C28.321786534672015%2C109.32209268672895%2C29.411887000313076&width=716&height=768&srs=EPSG%3A4326&styles=&format=application/openlayers',
            totalList: [
                {
                    label: "供给产品",
                    value: 41.23,
                },
                {
                    label: "文化服务",
                    value: 41.23,
                },
                {
                    label: "调节服务",
                    value: 41.23,
                },
            ],
            paramsList: [
                {
                    name: "价值量",
                    value: 0,
                    key: "syhy",
                    params: [
                        // {label: '降水量(mm/a)', value: '', key: 'Js'},
                        // {label: '径流系数', value: '', key: 'Jlxs'},
                        // {label: '蒸散发量(mm/a)', value: '', key: 'Zf'},
                        // {label: '生态系统面积(km2)', value: '', key: 'Landarea'},
                        // {label: "平均水价", value: "", key: "water_price", show: true},
                        // {
                        //   label: "单位水库清淤费用(元/m3)",
                        //   value: "",
                        //   key: "qingyu_price",
                        //   show: true,
                        // },
                        // {label: "碳价格(元/t)", value: "", key: "C_price", show: true},
                        // {label: "氧气价格（元/t）", value: "", key: "O2_price", show: true},
                        // {label: "当地生活消费电价（元/千瓦时）", value: "", key: "power_price", show: true},
                        // {label: "水库的建设成本", value: "", key: "jiansheweihu_price", show: true},
                        // {label: "大气污染物当量价值（元/t）", value: "", key: "shuishou_price", show: true},
                        {
                            label: "单位水库清淤费用(元/m3)",
                            value: "19.76",
                            key: "qingyu_price",
                            show: true,
                        },
                        {label: "碳价格(元/t)", value: "29.57", key: "C_price", show: true},
                        {label: "氧气价格（元/t）", value: "1000", key: "O2_price", show: true},
                        {label: "当地生活消费电价（元/千瓦时）", value: "0.52", key: "power_price", show: true},
                        {label: "水库的建设成本", value: "82.18", key: "jiansheweihu_price", show: true},
                        {label: "大气污染物当量价值（元/t）", value: "3500", key: "shuishou_price", show: true},
                    ],
                },
                {
                    name: "实物量",
                    value: 1,
                    key: "hstx",
                    params: [
                        // {label: "暴雨(mm/a)", value: "", key: "baoyu"},
                        // {label: "泥沙淤积系数", value: "", key: "lamda", show: true},
                        // {label: "土壤容重", value: "", key: "row", show: true},
                        // {label: "空调能效比", value: "", key: "r"},
                        // {label: "挥发潜热，即蒸发1克水所需要的热量（J/g）", value: "", key: "q"},
                        // {label: "加湿器将1m³水转化为蒸汽的耗电量(kW·h/m3)", value: "", key: "y"},

                        {label: "泥沙淤积系数", value: "0.24", key: "lamda", show: true},
                        {label: "土壤容重", value: "1.125", key: "row", show: true},
                        {label: "空调能效比", value: "3", key: "r"},
                        {label: "挥发潜热，即蒸发1克水所需要的热量（J/g）", value: "2450", key: "q"},
                        {label: "加湿器将1m³水转化为蒸汽的耗电量(kW·h/m3)", value: "120", key: "y"},
                        // {label: "蒸散系数", value: "", key: "Zfxs", show: true},
                        // {label: "空调能效比(3)", value: "", key: "qhtj_r", show: true},
                        // {
                        //     label: "加湿器将1m3水转化为蒸汽的耗电量（kW·h/m3)",
                        //     value: "",
                        //     key: "qhtj_y",
                        //     show: true,
                        // },
                        // {
                        //     label: "挥发潜热,即蒸发1克水所需要的热量（J/g )",
                        //     value: "",
                        //     key: "qhtj_q",
                        //     show: true,
                        // },
                        // {label: "化学需氧量排放量", value: "", key: "COD", show: true},
                        // {label: "氨氮排放总量", value: "", key: "shjjh_N", show: true},
                        // {label: "总磷排放总量", value: "", key: "shjjh_P", show: true},
                        // {label: "二氧化硫排放量", value: "", key: "SO2", show: true},
                        // {label: "氮氧化物总量", value: "", key: "NOx", show: true},
                        // // {label: '配置文件', value: '', key: 'baoyu'},
                        // // {label: '暴雨径流系数', value: '', key: 'stormrunoff'},
                        // // {label: '生态系统面积(km2)', value: '', key: 'Landarea'},
                        // {label: "化学需氧量排放量单位价格", value: "", key: "COD_price"},
                        // {label: "单位库容清理价格", value: "", key: "kurong_price"},
                        // {label: "单位库容运营价格", value: "", key: "yunying_price"},
                        // {label: "开发空调降温天数", value: "", key: "temp26"},
                        // {label: "氨氮排放单位价格", value: "", key: "N_price"},
                        // {label: "总磷排放单位价格", value: "", key: "P_price"},
                        // {label: "二氧化硫单位价格", value: "", key: "SO2_price"},
                        // {label: "氮氧化物单位价格", value: "", key: "NOx_price"},
                    ],
                },
            ],
            showHSDialog: false,
            HSProperty: {},
            viewportHeight: 0,
            viewportWidth: 0,
            height: 0,
            outputRes: ''
        };
    },
    computed: {
        totalValue() {
            return this.a.reduce((pre, cur, index) => {
                return pre + cur.value;
            }, 0);
        },
        region() {
            return this.$route.query.region || '四川省酉阳县';
        },
    },
    mounted() {
        // this.paramsList.forEach(item => {
        //     item.params.forEach(param => {
        //         param.value = -1
        //     })
        // })
        this.size();
        window.addEventListener("resize", this.size);

        document.title = `酉阳县生态产品价值实现平台`;
        for (let i = 0; i <= 10; i++) {
            this.options.push(this.year - i);
        }
        this.init();
    },
    watch: {
        viewportHeight(new1, val) {
            console.log(new1, val);
            // console.log(document.fullscreenElement);
            if (new1 > val && val != 0 && new1 == this.height) {
                document.querySelectorAll(".list .list-body")[1].style.height =
                    300 + "px";
                document.querySelectorAll(".list .list-body")[2].style.height =
                    315 + "px";
                document.querySelectorAll(".list .list-body")[3].style.height =
                    315 + "px";
                document.querySelector(".list-body").style.height = 300 + "px";
            } else {
                document.querySelector(".list-body").style.height = 230 + "px";
                document.querySelectorAll(".list .list-body")[1].style.height =
                    250 + "px";
                document.querySelectorAll(".list .list-body")[2].style.height =
                    245 + "px";
                document.querySelectorAll(".list .list-body")[3].style.height =
                    265 + "px";
            }
            console.log("实时屏幕高度：", val, this.windowHeight);
            // console.log(document.querySelector(".statistic-chart__bar"));
        },
        // 监听页面宽度
        viewportWidth(val) {
            console.log("实时屏幕宽度：", val, this.windowHeight);
        },
    },
    methods: {
        async uploadHandle(params) {
            console.log(params, params.file);
            const formData = new FormData();
            formData.append("file", params.file);
            const res = await service("post", "file/shape/upload", formData, "", 1, "formData");
            if (res.status === 200) {
                let polygon = JSON.parse(res.data);
                this.geometry = polygon;
                this.$refs.map.showUploadPolygon(polygon, (polyLayer) => {
                    const {lng, lat} = polyLayer.getBounds().getCenter();
                    this.$refs.map.setCenter([lat, lng], 18);
                    this.showFormDialog = true;
                });
            } else {
                this.$message.error(res.message);
            }
            // this.$refs.map.showPolygon(jsonData)
        },
        openBasicHandle(url) {
            this.$refs.map.showResult(url)
        },
        closeBasicHandler() {
            this.$refs.map.showResult()
        },
        toggleParamsHandler(index) {
            if (this.paramsList[index].show) {
                this.paramsList[index].show = false;
            } else {
                this.paramsList.forEach((item) => {
                    this.$set(item, "show", false);
                });
                this.$set(this.paramsList[index], "show", true);
            }
        },
        size() {
            console.log(111);
            this.viewportWidth = document.documentElement.clientWidth;
            this.viewportHeight = document.documentElement.clientHeight;
            this.height = document.body.scrollHeight;
            // 非全屏状态
        },
        toggleBasicParamsHandler(index) {
            if (this.projectList[index].show) {
                this.projectList[index].show = false;
            } else {
                this.projectList.forEach((item) => {
                    this.$set(item, "show", false);
                });
                this.$set(this.projectList[index], "show", true);
            }
        },
        // 技术文档列表
        async getPdfByCond() {
            // const res = await service(
            //   "post",
            //   "getPdfByCond",
            //   {
            //     region: this.region,
            //     page: "1",
            //     perPage: "1000",
            //   },
            //   "pdfServer",
            //   2
            // );
            // if (res.status === 0) {
            //   this.technologyList = res.data.items;
            //   console.log(res.data.items);
            // }
            this.technologyList = [
                {
                    jswd_name: "1_1_渝环函〔2023〕524重庆市生态环境局重庆市发展和改革委员会重庆市统计局关于印发《重庆市生态系统生产总值（GEP）核算技术指南（试行）》的函.pdf",
                    url: 'http://120.26.15.133:8098/pdf/58fbe1d6-bfb0-475b-b62c-8ea269571c51.pdf'
                },
                {
                    jswd_name:
                        "5_GEP核算技术规范.pdf",
                    url: 'http://120.26.15.133:8098/pdf/6bf13f6f-3685-4641-bb19-c4950e2dee44.pdf'
                },
                {
                    jswd_name:
                        "关于印发《生态产品总值核算规范（试行）》的通知发改基础[2022]481号(1).pdf",
                    url: 'http://120.26.15.133:8098/pdf/9f656990-1453-4d8c-ac31-990ef8763202.pdf'
                },
                {
                    jswd_name: "西阳统计年鉴2023.pdf",
                    url: 'http://120.26.15.133:8098/pdf/ec14dc2c-5680-4d8a-b2a9-257c54511e22.pdf'
                },
                {
                    jswd_name: "酉阳土家族苗族自治县2023年国民经济和社会发展统计公报.pdf",
                    url: 'http://120.26.15.133:8098/pdf/86773288-58d3-452e-802d-25f78e6d9960.pdf'
                },
                {
                    jswd_name: '2023年酉阳经济运行情况分析.pdf',
                    url: 'http://120.26.15.133:8098/pdf/361c137a-430f-4e0b-9b2b-7d20bfbba872.pdf'
                }
            ];
        },
        // 获取指定区域影像地图
        async getDistrictRasterTile() {
            //   const res = await service("get", "district/raster/tile", {
            //     region: this.region,
            //   });
            //   if (res.status === 200) {
            //     this.$nextTick(() => {
            //       console.log(res.data.url);
            //       this.$refs.map.setBaseTile(res.data.url);
            //     });
            //   }
        },
        draw(e) {
            this.$refs.map.startDrawPolygon(e);
        },
        drawRect(e) {
            this.$refs.map.startDrawRect(e);
        },
        async toggleCalculate() {
            if (!this.geometry) {
                this.$message.error("请绘制地块");
                return;
            }
            this.showFormDialog = true;
        },
        async submitCalculate(modelValue) {
            if (this.isCalculate) return;
            this.isCalculate = true;
            // const modelValue = this.$refs.dsForm.getModelValue();
            const params = this.$refs.paramsSetting.getParams();
            const res = await service("post", "/projectEP", {
                    ...this.geometry,
                    region: this.region,
                    projectName: modelValue.projectName,
                    basedata: {
                        ...params,
                    },
                },
                "geo_calc"
            );
            this.isCalculate = false;
            if (res.status === 0) {
                this.projectID = res.data.projectID;
                // this.projectID = 'a8fca39b-dc63-481f-b837-de98bf718195'

                // 计算结果演示效果
                this.showLoading = true;
                this.$nextTick(async () => {
                    this.$refs.loading.start()
                    await this.getCalcResultProgress()
                })
            } else {
                // this.projectID = 'a8fca39b-dc63-481f-b837-de98bf718195'
                // 计算结果演示效果
                // this.showLoading = true;
                // this.$nextTick(async() => {
                //     this.$refs.loading.start()
                //     await this.getCalcResultProgress()
                // })
                this.$refs.map.clearDraw()
                this.$message.error(res.msg)
            }
        },
        // 实时进度查询
        async getCalcResultProgress() {
            const res = await service('get', '/status', {
                task_id: this.projectID
            }, 'geo_calc')
            if (res.state == 'SUCCESS') {
                this.$refs.loading.done()
                setTimeout(() => {
                    this.showLoading = false
                }, 1500)
                this.getCalcResult();
            } else {
                setTimeout(() => {
                    this.getCalcResultProgress()
                }, 3000)
            }
            // this.$refs.map.clearDraw()
            // this.$refs.loading.done()
            // this.showLoading = false
            // this.$message.error(res.msg)
        },
        // EP计算结果
        async getCalcResult() {
            this.echartsLoading = true
            const res = await service('get', '/calResult', {
                task_id: this.projectID
            }, 'geo_calc')
            this.echartsLoading = false
            if (res.status === 0) {
                this.$message.success('EP核算成功！')
                this.getProjectBusinessList();
                if (res.data && res.data.items && res.data.items.length > 0) {
                    // this.EPResult = res.data.items[0].tjfw
                    // this.echartsData.tiaojie_jz = res.data.items[0].benefit.toFixed(2)
                    this.$nextTick(() => {
                        this.$refs.map.showResult(res.data.items[0].url)
                    })
                    // this.initEchartsEPResult();
                }
            } else {
                this.$message.error(res.msg)
            }
        },
        toggleParamsUpdate() {
            this.isParamsUpdate = !this.isParamsUpdate
        },
        togglePlay() {
            this.isPlay = !this.isPlay
        },
        listClickHandler(item) {
            this.id = item.id;
            this.HSProperty = item;
            this.getBaseData(item)
            if (!item.url) return;
            this.outputRes = item.output_res
            this.$refs.map.showResult(item.url)
            this.$refs.map.updateValue(item)
        },
        detailClickHandler(item) {
            console.log(item)
            this.id = item.id;
            this.HSProperty = item;
            this.showHSDialog = true;
        },
        customizeClickEventHandle() {
            this.showHSDialog = true;
        },
        init() {
            // this.getMapGeoJson();
            this.getPdfByCond();
            this.showBasicData();
            this.getProjectBusinessList();
            this.getDistrictRasterTile();
            this.getVectorTile();
            this.getBaseData();
        },
        // 获取基础数据列表
        async showBasicData(param) {
            const res = await service('post', 'getJCProCond', {
                page: 1,
                perPage: 10000,
                region: this.region,
                type: '',
                projectName: '',
                tifName: '',
            }, 'MapServer', 2)
            if (res.status === 0) {
                this.projectList[0].list = res.data.items
            }
        },
        async getBaseData(params) {
            const res = await service('get', 'getBaseData', {
                output_res: (params && params.output_res) ? params.output_res : 'default',
                region: this.region
            }, 'geo_calc')
            if (res.status === 0) {
                if (res.data && res.data.length > 0) {
                    const [baseData] = res.data;
                    console.log(baseData)
                    this.paramsList.forEach(item => {
                        item.params.forEach(param => {
                            param.value = baseData[param.key.toLowerCase()]
                        })
                    })
                }
            }
        },
        async getVectorTile() {
            // const res = await service("get", "district/vector/tile", {
            //   region: this.region + "行政边界",
            // });
            // if (res.status === 200) {
            //   if (res.data.url && res.data.url !== "null") {
            //     this.$refs.map.setBaseVecotrTile(res.data.url);
            //   }
            // }
            let json = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            id: "944322949677330432",
                            pid: "59",
                            name: "安吉县芝里西地块",
                            type: "EP",
                            totalValue: "1145.37",
                            landWealth: "41500.0",
                        },
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: [
                                [
                                    [
                                        [108.769, 28.867],
                                        [108.771, 28.865],
                                        [108.774, 28.865],
                                        [108.776, 28.868],
                                        [108.775, 28.871],
                                        [108.773, 28.873],
                                        [108.77, 28.872],
                                        [108.768, 28.869],
                                    ],
                                ],
                            ],
                        },
                    },
                    {
                        type: "Feature",
                        properties: {
                            id: "944322949677330432",
                            pid: "59",
                            name: "安吉县芝里西地块",
                            type: "EP",
                            totalValue: "1145.37",
                            landWealth: "41500.0",
                        },
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: [
                                [
                                    [
                                        [108.74, 28.875],
                                        [108.742, 28.878],
                                        [108.744, 28.88],
                                        [108.746, 28.882],
                                        [108.748, 28.883],
                                        [108.749, 28.864],
                                        [108.752, 28.866],
                                        [108.754, 28.869],
                                        [108.756, 28.872],
                                        [108.756, 28.875],
                                        [108.755, 28.878],
                                        [108.753, 28.88],
                                        [108.751, 28.882],
                                        [108.746, 28.883],
                                        [108.744, 28.88],
                                        [108.742, 28.878],
                                        [108.74, 28.869],
                                    ],
                                ],
                            ],
                        },
                    },
                    {
                        type: "Feature",
                        properties: {
                            id: "944322949677330432",
                            pid: "59",
                            name: "安吉县芝里西地块",
                            type: "EP",
                            totalValue: "1145.37",
                            landWealth: "41500.0",
                        },
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: [
                                [
                                    [
                                        [108.76, 29.05],
                                        [108.77, 29.04],
                                        [108.76, 29.03],
                                        [108.752, 29.032],
                                    ],
                                ],
                            ],
                        },
                    },
                    {
                        type: "Feature",
                        properties: {
                            id: "944322949677330432",
                            pid: "59",
                            name: "安吉县芝里西地块",
                            type: "EP",
                            totalValue: "1145.37",
                            landWealth: "41500.0",
                        },
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: [
                                [
                                    [
                                        [108.78, 29.032],
                                        [108.785, 29.028],
                                        [108.79, 29.034],
                                    ],
                                ],
                            ],
                        },
                    },
                ],
            };
            this.$refs.map.showPolygon(json);
            this.$refs.map.setBaseVecotrTile(youyangJson);
            this.$refs.map.setBaseTile(this.yyUrl)
        },
        // 获取地图geo
        async getMapGeoJson() {
            const parent = ''
            const res = await service('get', 'district/geojson', {
                parent: parent
            })
            if (res.status === 200) {
                if (res.data) {
                    let jsonData = JSON.parse(res.data)
                    jsonData.features = jsonData.features.filter(item => item.properties.name === this.region)
                    this.$refs.map.setRegion(jsonData)
                }
            }
        },
        dragendHandler(json) {
            this.geometry = json
            console.log('json', this.geometry)
            console.log('json', JSON.stringify(this.geometry.coordinates))
        },
        // 核算结果列表
        async getProjectBusinessList() {
            const res = await service('get', 'calcHistory', {
                region: this.region,
                // page: 1,
                // perPage: 1000,
            }, 'webserver')
            if (res.status === 200) {
                this.accountingResultsList = res.data.items
            }
        },
        changeYear(year) {
            this.year = year
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
    // background-image: url("../../assets/images/common/bg.png");
    background-repeat: repeat;
    background-position: center center;
    background-size: cover;
    min-height: 100vh;
    overflow: hidden;
    background-color: #08122b;

    &.fullscreen {
        .map-wrapper {
            // min-height: calc(~"100vh - 120px");
        }
    }

    &-container {
        box-sizing: border-box;
        position: relative;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
        overflow: hidden;
        background-image: url("../../assets/images/common/body-bg.png");

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

            &__content {
                padding: 0 20px;
                position: relative;
            }
        }

        .map {
            margin: 0 auto;
            position: relative;
            z-index: 0;

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
                min-height: calc(~"100vh ");
                position: relative;
                margin: 0 auto;
            }
        }
    }
}

// .btn {
//   margin: 0 auto;
//   position: relative;
//   z-index: 0;
//   .btn-back {
//     position: absolute;
//     top: 0;
//     right: -168px;
//   }
// }

.opera {
    position: absolute;
    top: -10px;
    left: -280px;
    display: flex;

    &-wrapper {
        position: relative;

        &.flex {
            display: flex;
            margin-right: 20px;
            margin-top: -10px;
        }

        &__form {
            position: absolute;
            right: 0;
            top: 100%;
            width: 312px;

            .form {
            }
        }
    }

    &-icon {
        width: 64px;
        height: 64px;
        border-radius: 100%;
        background: url("../../assets/images/county/icon-cicrle.png") no-repeat 0 0;
        background-size: contain;
        position: relative;
        cursor: pointer;

        &.draw {
            &:before {
                content: "";
                background: url("../../assets/images/county/icon-draw.png") no-repeat 0 0;
                background-size: cover;
                width: 30px;
                height: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        &.draw-rect {
            &:before {
                content: "";
                background: url("../../assets/images/county/icon-draw-rect.png") no-repeat 0 0;
                background-size: cover;
                width: 30px;
                height: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        &.stop {
            &:before {
                content: "";
                background: url("../../assets/images/county/icon-stop.png") no-repeat 0 0;
                background-size: cover;
                width: 30px;
                height: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        &.play {
            &:before {
                content: "";
                background: url("../../assets/images/county/icon-play.png") no-repeat 0 0;
                background-size: cover;
                width: 30px;
                height: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }

    &-btn {
        width: 96px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        box-shadow: 0px 0px 8px 0px rgba(72, 129, 255, 0.58);
        background: linear-gradient(171deg,
        rgba(72, 129, 255, 0.65),
        rgba(72, 129, 255, 0.36),
        rgba(72, 129, 255, 0.54),
        rgba(72, 129, 255, 0.65),
        rgba(72, 129, 255, 1)) 1 1;
        font-size: 14px;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #ffffff;
        border-radius: 25px;
        margin-bottom: 24px;
        cursor: pointer;

        &.primary {
            background: rgba(72, 129, 255, 0.52);
        }
    }
}

//.fullscreen {
//    position: absolute;
//    right: 40px;
//    top: 15px;
//    cursor: pointer;
//
//    img {
//        width: 49px;
//        height: 48px;
//    }
//}

.btn-back {
    position: relative;
    height: 35px;
    margin-top: -10px;
}

.select {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: -7px;
    right: 20px;
    z-index: 1;
    width: 113px;

    /deep/ .el-input__inner {
        background-color: transparent;
        border: none;
        border-radius: 0;
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        line-height: 30px;
        height: 36px;
        width: 113px;
        background-image: url("../../assets/images/common/input-bg.png");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: contain;

        &::placeholder {
            color: #fff;
        }
    }

    /deep/ .el-select__caret {
        transform: rotateZ(0deg);

        &.el-input__icon {
            line-height: 36px;

            &.is-reverse {
                transform: rotateZ(180deg);
            }
        }

        &.el-input__icon::before {
            content: "\e790";
            color: rgba(79, 186, 248, 1);
            position: absolute;
            width: 100%;
            height: 100%;
            top: 50%;
            left: 50%;
            font-size: 12px;
            transform: translate(-50%, -50%);
            //background-image: url("../../../../assets/images/common/input-arrow.png");
            //background-repeat: no-repeat;
            //background-size: 9px 5px;
            //background-position: 0 center;
        }
    }
}
</style>
