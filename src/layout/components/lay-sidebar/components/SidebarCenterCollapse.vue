<script setup>
import { useNav } from "@/layout/hooks/useNav";
import ArrowLeft from "@iconify-icons/ri/arrow-left-double-fill";
import { useGlobal } from "@pureadmin/utils";
import { computed } from "vue";

import { useI18n } from "vue-i18n";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
  // 其他 props 的定义
});

const emit = defineEmits(["toggleClick"]);
const { t } = useI18n();
const { tooltipEffect } = useNav();

const iconClass = computed(() => {
  return ["w-[16px]", "h-[16px]"];
});

const { $storage } = useGlobal();
const themeColor = computed(() => $storage.layout?.themeColor);

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div
    v-tippy="{
      content: isActive
        ? t('buttons.pureClickCollapse')
        : t('buttons.pureClickExpand'),
      theme: tooltipEffect,
      hideOnClick: 'toggle',
      placement: 'right'
    }"
    class="center-collapse"
    @click="toggleClick"
  >
    <IconifyIconOffline
      :icon="ArrowLeft"
      :class="[iconClass, themeColor === 'light' ? '' : 'text-primary']"
      :style="{ transform: isActive ? 'none' : 'rotateY(180deg)' }"
    />
  </div>
</template>

<style lang="scss" scoped>
.center-collapse {
  position: absolute;
  top: 50%;
  right: 2px;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 34px;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--pure-border-color);
  border-radius: 4px;
  transform: translate(12px, -50%);
}
</style>
