<script setup lang="ts">
import type { ButtonProps, TreeOption, TreeProps } from 'naive-ui'
import { NButton } from 'naive-ui'
import { isEmpty, isNil, padStart, pull, union, xor } from 'lodash'
import fsApi from '~/api/fs'
import type { FSItem } from '~/types'

const basePath = '/'
const data = ref<Array<TreeOption>>([
  convertToTreeOption({
    name: basePath,
    abs_path: basePath,
    is_dir: true,
  }),
])

// region Setup Tree
const expandedKeys = ref<Array<string>>([basePath])
const checkedKeys = ref<Array<string>>([])
const checkedKeysIsEmpty = computed(() => isEmpty(checkedKeys.value))
const sortedCheckedKeys = computed(() => checkedKeys.value.toSorted())
const pattern = ref('')

const filter: NonNullable<TreeProps['filter']> = ($pattern, option) => {
  if ($pattern === '')
    return true

  const label = option.label
  if (isNil(label))
    return false

  return label.toLowerCase().includes($pattern.toLowerCase())
}

const { copy } = useClipboard({ legacy: true })
const message = useMessage()
function convertToTreeOption(fsItem: FSItem): TreeOption {
  const option: TreeOption = {
    label: fsItem.name,
    key: fsItem.abs_path,
    isLeaf: !fsItem.is_dir,
    checkboxDisabled: fsItem.is_dir,
    prefix: () => {
      if (fsItem.is_dir)
        return '📁'
      else
        return '📄'
    },
    suffix: () => {
      if (option.isLeaf) {
        return h(
          NButton,
          {
            size: 'tiny',
            ghost: true,
            dashed: true,
            onClick: async () => {
              await copy(fsItem.abs_path)
              message.success(`已复制: [ ${fsItem.abs_path} ]`)
            },
          } as ButtonProps,
          () => '复制',
        )
      }
      if (!option.isLeaf && option.children?.length !== 0 && expandedKeys.value.includes(option.key as string)) {
        return h(
          NButton,
          {
            size: 'tiny',
            ghost: true,
            dashed: true,
            onClick: () => {
              checkedKeys.value = union(
                checkedKeys.value,
                option.children!
                  .filter(child => child.isLeaf)
                  .filter(child => filter(pattern.value, child))
                  .map(child => child.key as string),
              )
            },
            disabled: isNil(option.children) || option.children.every(child => !child.isLeaf),
          } as ButtonProps,
          () => '全选',
        )
      }
    },
  }
  return option
}

async function handleLoad(node: TreeOption) {
  const absPath = node.key as string
  const res = await fsApi.ls(absPath)
  const fsItems = res.data
  node.children = fsItems.map(convertToTreeOption)
}

const labelRender: NonNullable<TreeProps['renderLabel']> = (info) => {
  return h(
    'div',
    {
      onClick: () => {
        if (info.option.isLeaf)
          checkedKeys.value = xor(checkedKeys.value, [info.option.key as string])
        else
          expandedKeys.value = xor(expandedKeys.value, [info.option.key as string])
      },
    },
    [info.option.label],
  )
}

// endregion Setup Tree

function handleCopy() {
  fsSelectEmitter.emit('copy', sortedCheckedKeys.value)
}

const showPreview = ref(false)
function handleRemoveCheckedKey(key: string) {
  pull(checkedKeys.value, key)
}

// TODO: 实现刷新功能
</script>

<template>
  <div class="fs-select" h-full flex flex-col overflow-hidden>
    <n-space size="small" class="fs-select__actions" flex-none>
      <NButton :disabled="checkedKeysIsEmpty" size="small" @click="handleCopy">
        导入到左侧
      </NButton>
      <NButton :disabled="checkedKeysIsEmpty" size="small" @click="showPreview = true">
        预览
      </NButton>
      <NButton :disabled="checkedKeysIsEmpty" size="small" @click="checkedKeys = []">
        清空
      </NButton>
      <n-input v-model:value="pattern" size="small" placeholder="过滤文件名" clearable />
    </n-space>
    <n-divider flex-none important-my-12px />
    <div class="fs-select__tree" h-full overflow-auto>
      <n-tree
        v-model:expanded-keys="expandedKeys"
        v-model:checked-keys="checkedKeys"
        :data="data"

        :render-label="labelRender"
        :pattern="pattern"
        :filter="filter"
        :show-irrelevant-nodes="false"
        checkable selectable show-line block-line
        :on-load="handleLoad"
      />
    </div>
    <n-modal v-model:show="showPreview" class="fs-select__preview" h-80vh max-h-80vh max-w-80vw w-600px overflow-auto>
      <n-card>
        <n-list hoverable>
          <n-list-item v-for="(checkedKey, idx) in sortedCheckedKeys" :key="checkedKey">
            <template #prefix>
              <n-tag size="small">
                {{ padStart((idx + 1).toString(), sortedCheckedKeys.length.toString().length, '0') }}
              </n-tag>
            </template>
            <template #suffix>
              <NButton size="tiny" @click="handleRemoveCheckedKey(checkedKey)">
                移除
              </NButton>
            </template>
            {{ checkedKey }}
          </n-list-item>
        </n-list>
      </n-card>
    </n-modal>
  </div>
</template>
