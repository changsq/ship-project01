<template>
    <a-modal :visible="visible" @cancel="Oncancel">
        <template #title>
            <span class="modal-title">编辑数据</span>
        </template>
        <a-form v-if="this.table === '0'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name0" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '1'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name1" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '2'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name2" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '3'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name3" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '4'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name4" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '5'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name5" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '6'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name6" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '7'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name7" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '8'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name8" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <a-form v-if="this.table === '9'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;">
            <div v-for="(item) in name9" :key="item[0]">
                <a-form-item :label="item[1]" :name="item[0]"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input :placeholder="data[item[0]]" v-model="data[item[0]]" />
                </a-form-item>
            </div>
        </a-form>
        <template slot="footer">
            <a-button key="cancel" @click="Oncancel">取消</a-button>
            <a-button key="submit" @click="Onsubmit" type="primary">确定</a-button>
        </template>
    </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import axios from 'axios';
export default {
    props: {
        table: String,
    },
    data() {
        return {
            name0: [
                ['id', 'ID'],
                ['powerType', '动力类别'],
                ['model', '型号'],
                ['price', '价格'],
                ['ratedPower', '额定功率'],
                ['minConsumption', '最低消耗'],
                ['discountRate', '折率'],
                ['fuelPrice', '燃料价格'],
                ['failureRate', '故障率'],
                ['length', '长'],
                ['width', '宽'],
                ['height', '高'],
                ['weight', '重量'],
                ['overhaulPeriod', '拆检周期'],
                ['majorOverhaulPrice', '大修价格'],
                ['minorOverhaulPrice', '小修价格'],
                ['maturity', '成熟度'],
                ['carbonConversionFactor', '碳转化系数'],
                ['serviceLife', '使用寿命'],
                ['applicableWaterArea', '适用水域'],
                ['fuelType', '燃料类型'],
                ['fuelQuantity', '燃料量'],
                ['applicableShipType', '适用船型'],
                ['applicableShipTonnage', '适用船舶吨位'],
                ['numEngines', '主机数量'],
                ['powerSystem', '动力系统']
            ],

            name1: [
                ['id', 'ID'],
                ['model', '型号'],
                ['price', '价格'],
                ['propulsionType', '推进类型'],
                ['material', '材质'],
                ['diameter', '直径'],
                ['bladeCount', '叶片数量'],
                ['bladeAngle', '叶片角度'],
                ['thrust', '推力'],
                ['efficiency', '效率'],
                ['weight', '重量'],
                ['antiCorrosion', '防腐措施'],
                ['maintenancePeriod', '维护周期'],
                ['vibrationLevel', '振动等级'],
                ['temperatureRange', '工作温度范围'],
                ['applicableWaterArea', '适用水域'],
                ['maintenancePrice', '维护费用']
            ],

            name2: [
                ['id', 'ID'],
                ['tailShaftModel', '尾轴型号'],
                ['diameter', '直径'],
                ['length', '长度'],
                ['material', '材质'],
                ['surfaceTreatment', '表面处理'],
                ['bearingType', '轴承类型'],
                ['bearingPosition', '轴承位置'],
                ['lubricationMethod', '润滑方式'],
                ['sealingMethod', '密封方式'],
                ['connectionMethod', '连接方式'],
                ['maxTorque', '最大扭矩'],
                ['maxSpeed', '最大转速'],
                ['allowableStress', '许用应力'],
                ['fatigueStrength', '疲劳强度'],
                ['corrosionResistance', '耐腐蚀性'],
                ['temperatureRange', '工作温度范围'],
                ['toleranceRequirement', '公差要求'],
                ['weight', '重量'],
                ['manufacturer', '制造商'],
                ['certificationStandard', '认证标准'],
                ['price', '价格'],
                ['maintenanceInterval', '维护间隔（年）'],
                ['maintenancePrice', '维护费用'],
                ['applicableWaterArea', '适用水域'],
                ['applicablePowerSystem', '适用动力系统']
            ],
            name3: [
                ['id', 'ID'],
                ['model', '型号'],
                ['price', '价格'],
                ['gearRatio', '传动比'],
                ['torqueCapacity', '扭矩容量'],
                ['material', '材质'],
                ['noiseLevel', '噪音水平'],
                ['durability', '耐用性'],
                ['weight', '重量'],
                ['maintenancePeriod', '维护周期'],
                ['vibrationLevel', '振动等级'],
                ['temperatureRange', '工作温度范围'],
                ['applicableWaterArea', '适用水域'],
                ['maintenancePrice', '维护费用'],
                ['applicablePowerSystem', '适用动力系统'],
                ['inputPower', '输入功率'],
                ['outPower', '输出功率']
            ],
            name4: [
                ['id', 'ID'],
                ['model', '型号'],
                ['diameter', '直径'],
                ['length', '长度'],
                ['material', '材质'],
                ['maxTorque', '最大扭矩'],
                ['speed', '速度'],
                ['journalDiameter', '轴颈直径'],
                ['flangeSpecification', '法兰规格'],
                ['keySlotAndKey', '键槽和键'],
                ['surfaceRoughness', '表面粗糙度'],
                ['runout', '径跳'],
                ['cylindricity', '圆柱度'],
                ['roundness', '圆度'],
                ['durability', '耐用性'],
                ['noiseLevel', '噪音水平'],
                ['vibrationLevel', '振动等级'],
                ['temperatureRange', '工作温度范围'],
                ['maintenancePeriod', '维护周期'],
                ['applicableWaterArea', '适用水域'],
                ['maintenancePrice', '维护费用'],
                ['applicablePowerSystem', '适用动力系统'],
                ['inputPower', '输入功率'],
                ['outputPower', '输出功率'],
                ['transmissionRatio', '传动比'],
                ['weight', '重量'],
                ['lubricationMethod', '润滑方式'],
                ['connectionMethod', '连接方式'],
                ['protectiveMeasures', '防护措施'],
                ['certificationAndStandards', '认证和标准'],
                ['price', '价格'],
                ['manufacturer', '制造商']
            ],
            name5: [
                ['id', 'ID'],
                ['model', '型号'],
                ['price', '价格'],
                ['length', '长度'],
                ['diameter', '直径'],
                ['material', '材质'],
                ['maxTorque', '最大扭矩'],
                ['fatigueLife', '疲劳寿命'],
                ['weight', '重量'],
                ['antiCorrosion', '防腐措施'],
                ['maintenancePeriod', '维护周期'],
                ['vibrationLevel', '振动等级'],
                ['temperatureRange', '工作温度范围'],
                ['applicableWaterArea', '适用水域'],
                ['maintenancePrice', '维护费用'],
                ['applicableShipType', '适用船型'],
                ['mainEnginePower', '主发动机功率'],
                ['speed', '速度'],
                ['manufacturer', '制造商']
            ],
            name6: [
                ['id', 'ID'],
                ['waterAreaName', '水域名称'],
                ['levelOfNavigationArea', '航道等级'],
                ['minimumBendingRadiusOfNavigationArea', '最小转弯半径'],
                ['averageWaterDepth', '平均水深'],
                ['maximumWaterDepth', '最大水深'],
                ['minimumWaterDepth', '最小水深'],
                ['numberOfIslands', '岛屿数量'],
                ['waterLength', '水域长度'],
                ['averageWidth', '平均宽度'],
                ['maximumWidth', '最大宽度']
            ],
            name7: [
                ['id', 'ID'],
                ['segmentName', '段名'],
                ['segmentPorts', '沿线港口'],
                ['segmentLength', '段长（公里）'],
                ['segmentComplexity', '复杂程度'],
                ['coastalEmissionLevel', '沿海排放等级'],
                ['averageDepth', '平均水深（米）'],
                ['maxDepth', '最大水深（米）'],
                ['minDepth', '最小水深（米）'],
                ['averageWidth', '平均宽度（米）'],
                ['maxWidth', '最大宽度（米）'],
                ['minWidth', '最小宽度（米）'],
                ['applicableShipTonnage', '适用船舶吨位'],
                ['belongingWaterSystem', '所属水系']
            ],
            name8: [
                ['id', 'ID'],
                ['harbourName', '港口名称'],
                ['harbourCode', '港口代码'],
                ['country', '国家'],
                ['longitude', '经度'],
                ['latitude', '纬度'],
                ['magneticVariation', '磁偏角'],
                ['entryAndExitPoint', '进出点'],
                ['publiclyAnnounced', '是否公开']
            ],
            name9: [
                ['id', 'ID'],
                ['level_id', '级别ID'],
                ['level', '级别名称'],
                ['request', '请求内容'],
                ['implementationData', '实施日期'],
                ['applicableWaterArea_id', '适用水域ID']
            ],
            chooseId: 0,
            url: ``,
            data: {},
            visible: false,
            privilegeName: [
                { id: 1, name: '增', key: 'add' },
                { id: 2, name: '删', key: 'del' },
                { id: 3, name: '改', key: 'edit' },
                { id: 4, name: '查', key: 'check' }
            ],
            user: {
                userName: '',
                password: '',
                enabled: 1
            },
            role: { name: 'admin' },
            privilege: {
                add: false,
                del: false,
                edit: false,
                check: false
            }
        }
    },
    methods: {
        show(item) {
            this.visible = true
            console.log(item, 'ssss');
            if (item) {
                console.log('csq', item);
                this.data = item;
                this.chooseId = item.id
            }
        },
        chooseUrl(table) {
            let url = ''; // 使用 let 声明变量
            switch (table) {
                case '0':
                    url = `/bcd/api/powerunit/${this.chooseId}`;
                    break;
                case '1':
                    url = `/bcd/api/propeller-news/${this.chooseId}`;
                    break;
                case '2':
                    url = `/bcd/api/stern-shaft/${this.chooseId}`;
                    break;
                case '3':
                    url = `/bcd/api/gearbox-news/${this.chooseId}`;
                    break;
                case '4':
                    url = `/bcd/api/intermediate-shafts/${this.chooseId}`;
                    break;
                case '5':
                    url = `/bcd/api/grank-shafts/${this.chooseId}`;
                    break;
                case '6':
                    url = `/bcd/api/water-areas/${this.chooseId}`;
                    break;
                case '7':
                    url = `/bcd/api/inland-river-segments/${this.chooseId}`;
                    break;
                case '8':
                    url = `/bcd/api/harbours/${this.chooseId}`;
                    break;
                case '9':
                    url = `/bcd/api/emission-level/${this.chooseId}`;
                    break;
                default:
                    console.error('Invalid table value:', table);
                    break;
            }
            return url; // 返回 URL
        },
        Onsubmit() {
            const url = this.chooseUrl(this.table);
            const datae = this.data;
            this.$axios({
                url: url,
                method: "put",
                data: datae
            }).then(() => {
                message.info('修改成功！')
                this.$emit('editFinish')
                this.visible = false
                console.log('edit finish');
            })
        },
        Oncancel() {
            this.visible = false
        }
    },
};
</script>

<style scoped></style>