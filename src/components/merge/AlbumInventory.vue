<script setup>
import { ref, reactive, computed } from 'vue'
import { useMergeGameStore } from '@/stores/mergeGame'
import AlbumTag from './AlbumTag.vue'

const { forces } = defineProps({ forces: Object })

const merge = useMergeGameStore()
const album = computed(() => merge.album)
const tickets = computed(() => merge.tickets)

const dialog = reactive({ open: false })
const good = ref(null)
const openOperatorPanel = (id, forceUnlock) => {
  good.value = album.value[id]
  dialog.open = true
  dialog.type = 'buy'
  dialog.forceUnlock = forceUnlock
  dialog.isSp = false
  dialog.price = ''
  dialog.canAfford = false
  dialog.able = false
  if (!good.value.unlock) {
    dialog.type = 'unlock'
  }
  if (good.value.sp > 0) {
    dialog.isSp = true
  }
  const price = merge.getPrice(album.value[id].rarity, dialog.type)
  dialog.price = Object.entries(price)
    .map(([color, v]) => `${v}${color === 'yellow' ? '黄票' : '绿票'}`)
    .join()
  dialog.canAfford = Object.entries(price).reduce(
    (res, [color, v]) => res && tickets.value[color] >= v,
    true
  )
  dialog.able = (dialog.type === 'buy' || (dialog.forceUnlock && !dialog.isSp)) && dialog.canAfford
}

const buy = (id) => {
  merge.buy(id)
  dialog.open = false
}
</script>
<template>
  <v-sheet>
    <div class="d-flex flex-clomun mb-2" v-for="force in forces" :key="force.id">
      <div>
        <v-btn :color="force.color">
          {{ force.name || force.id }} {{ force.favor }} / {{ force.allFavor }}
        </v-btn>
        <div class="d-flex flex-wrap">
          <album-tag
            @click="openOperatorPanel(char, force.unlock)"
            v-for="char in force.chars"
            :key="char"
            :char="album[char]"
            :forceColor="force.color"
            :forceUnlock="force.unlock"
          >
          </album-tag>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog.open" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-chess-rook"
        :title="`${dialog.type === 'unlock' ? '解锁' : '调用'}干员`"
      >
        <v-card-text>
          <div v-if="dialog.type === 'buy'" class="d-flex flex-column">
            <span>【代号】{{ good.name }}</span>
            <span>【信赖】{{ good.favor }}</span>
            <v-alert
              :color="dialog.canAfford ? 'primary' : 'error'"
              variant="tonal"
              density="compact"
              class="mt-1"
            >
              使用{{ dialog.price }}调用干员
            </v-alert>
          </div>
          <div v-else-if="dialog.forceUnlock">
            <div v-if="dialog.isSp">
              <span>【代号】{{ good.name }}</span>
              <v-alert
                type="warning"
                color="primary"
                variant="tonal"
                density="compact"
                class="mt-1"
              >
                升变/异格干员无法直接解锁
              </v-alert>
            </div>
            <div v-else>
              <span>【代号】{{ good.name }}</span>
              <v-alert
                :color="dialog.canAfford ? 'primary' : 'error'"
                variant="tonal"
                density="compact"
                class="mt-1"
              >
                使用{{ dialog.price }}解锁干员
              </v-alert>
            </div>
          </div>
          <div v-else>
            <v-alert type="warning" color="primary" variant="tonal" density="compact" class="mt-1">
              未知干员，可通过提高该阵营已解锁干员的信赖获得线索
            </v-alert>
          </div>
        </v-card-text>
        <template v-slot:actions>
          <v-btn text="关闭" variant="plain" @click="dialog.open = false"></v-btn>
          <v-btn
            v-if="dialog.able"
            color="primary"
            :text="dialog.type === 'unlock' ? '解锁' : '调用'"
            variant="tonal"
            @click="buy(good.id)"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
