<template>
    <a-modal :visible="visible" :width="1100" @cancel="Oncancel">
        <template #title>
            <span class="modal-title">生成方案</span>
        </template>
        <a-card style="width: 90%; margin: auto; background-color: #fbfbfb;">

            <a-form v-if="scheme && this.scheme.length > 0">
                <a-table :columns="columns" :dataSource="scheme"></a-table>
            </a-form>
            <div v-else style="height:700px;">
                <a-icon style="position: absolute;font-size:40px;margin: 30% 45%;" type="loading" />
            </div>
        </a-card>
        <template slot="footer">
            <a-button v-show="false" key="back">取消</a-button>
            <a-button v-show="false" key="submit" type="primary">确定</a-button>
        </template>
    </a-modal>
</template>

<script>

export default {
    props: {
        scheme: Array,
    },
    computed: {
        dataSourceComputed() {
            return this.scheme.length > 0 ? this.scheme : this.datastorage;
        }
    },
    data() {
        return {
            visible: false,
            data: [],
            datastorage: {},
            updateTime: '',
            text: '',
            updateData: true,
            percentage: 0,
            timer: null,
            columns: [
                { title: '动力系统', dataIndex: 'powerUnitModel', key: '0', width: '25%', align: 'center' },
                { title: '螺旋桨', dataIndex: 'propellerModel', key: '1', width: '25%', align: 'center' },
                { title: '轴', dataIndex: 'shaftModel', key: '2', width: '25%', align: 'center' },
                { title: '齿轮箱', dataIndex: 'gearboxModel', key: '3', width: '25%', align: 'center' }
            ]
        }
    },
    mounted() {
    },
    methods: {

        show() {
            this.$nextTick(() => {
                const scheme1 = JSON.parse(localStorage.getItem('scheme1'))
                const scheme2 = JSON.parse(localStorage.getItem('scheme2'))
                const updateTime1 = localStorage.getItem('updateTime1')
                const updateTime2 = localStorage.getItem('updateTime2')

                if (updateTime1 && this.whichButton === 1) {
                    this.updateTime = updateTime1
                }
                else if (updateTime2 && this.whichButton === 2) {
                    this.updateTime = updateTime2
                } else {
                    this.updateTime = ''
                }

                if (scheme1 && this.whichButton === 1) {
                    this.datastorage = scheme1
                    this.updateData = true
                }
                else if (scheme2 && this.whichButton === 2) {
                    this.datastorage = scheme2
                    this.updateData = true
                } else {
                    this.datastorage = {}
                    this.updateData = false
                }
                console.log('ssss', this.datastorage, this.updateData, this.scheme);
                this.visible = true
                this.updateTextBasedOnButton();
            });
        },

        Oncancel() {
            this.visible = false
            clearInterval(this.timer);
        },
        countPercent() {
            this.percentage = 0; // 重置进度为0
            this.timer = setInterval(() => {
                this.updateProgress();
            }, 1000); // 每隔1秒更新一次进度
        },
        updateProgress() {
            if (this.percentage < 100) {
                this.percentage += 2.5;
            } else {
                clearInterval(this.timer); // 清除定时器
            }
        },
        updateTextBasedOnButton() {
            switch (this.whichButton) {
                case 0:
                    this.text = '生成方案'
                    break;
                case 1:
                    this.text = '适用性评估结果（id）'
                    break;
                case 2:
                    this.text = '优化评估结果（id）'
                    break;
                default:
                    break;
            }
        },
    }
}
</script>

<style scoped></style>