<template>
  <span v-if="typeof value !== 'object' || value === null" :title="value" :class="{'missing': value===''}">
    <template v-if="value!==null && value!==undefined && value!==''">
      &nbsp;{{ value }}&nbsp;
    </template>
  </span>
  <div v-else class="graphic-ht-container">
    <DataBar
      :key="value.key+'databar'"
      :missing="value.missing"
      :total="+value.total"
      :mismatch="+value.mismatch"
      :nullV="+value.null"
      class="table-data-bar"
      bottom
    />
    <Frequent
      v-if="value.frequency"
      :key="value.key"
      :uniques="value.count_uniques"
      :values="value.frequency"
      :total="+value.frequency[0].count"
      :columnIndex="value.index"
      class="histfreq"
      table
    />
    <Histogram
      v-else-if="value.hist"
      :key="value.key"
      :uniques="value.count_uniques"
      :values="value.hist"
      :total="+value.total"
      :columnIndex="value.index"
      class="histfreq"
      table
    />
    <Histogram
      v-else-if="value.hist_years"
      :key="value.key"
      :uniques="value.count_uniques"
      :values="value.hist_years"
      :total="+value.total"
      :columnIndex="value.index"
      class="histfreq"
      table
    />
  </div>
</template>

<script>

import Histogram from '@/components/Histogram'
import Frequent from '@/components/Frequent'
import DataBar from '@/components/DataBar'

export default {

	components: {
		Histogram,
		Frequent,
		DataBar
	},

	props: {
		// hotInstance: null,
		// row: null,
		// col: null,
		// value: 0
	}
}

</script>

<style lang="scss">
  .graphic-ht-container {
    height: 90px;
    display: flex;
    flex-direction: column;
    margin: 0 -4px 2px -4px;

    position: relative;

    .table-data-bar {
      margin-bottom: 2px;
      font-size: 4px;
    }

    .histfreq {
      flex: 1;
    }
  }
</style>
