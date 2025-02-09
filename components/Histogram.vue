<template>
  <div class="bb-graphic" @mouseleave="currentCount = false">
    <h3 v-if="!table">{{ title }}</h3>
    <BarsCanvas
      :selectable="table"
      :selected="selected"
      :values="values"
      :maxVal="maxVal"
      :binMargin="1"
      :width="'auto'"
      :height="table ? 66 : 90"
      @update:selected="updateSelected"
      @hovered="setValueIndex($event)"
    />
    <div v-if="currentValueString" :title="currentValueString" class="current-value">{{ currentValueString }}</div>
  </div>
</template>

<script>
import BarsCanvas from '@/components/BarsCanvas'
import { reduceRanges, arraysEqual } from '@/utils/functions.js'
import { mapState, mapGetters } from 'vuex';

export default {

  components: {
    BarsCanvas
  },

	props: {
		values: {
			default: () => ([]),
			type: Array
		},
		total: {
			default: 1,
			type: Number
		},
		title: {
			default: '',
			type: String
		},
		table: {
			default: false,
			type: Boolean
    },
    columnIndex: {
      default: -1,
      type: Number
    },
		selectable: {
			default: false,
			type: Boolean
    },
	},

	data () {
		return {
			maxVal: 0,
			currentLower: 0,
			currentUpper: 0,
			currentCount: false,
			lower: '',
      selected: [],
      upper: '',
		}
  },

  computed: {

    ...mapGetters(['currentSelection']),
    ...mapState(['datasetSelection','tab']),

    currentValueString () {
      if (this.currentCount)
        return this.$options.filters.humanNumber(this.currentLower) + ' - ' + this.$options.filters.humanNumber(this.currentUpper) + ', ' + this.currentCount
      else
        return this.$options.filters.humanNumber(this.lower) + ' - ' + this.$options.filters.humanNumber(this.upper)
    },
  },

	beforeMount () {
		this.maxVal = this.getMaxVal(this.values)
		this.lower = (+this.values[0].lower).toFixed(2)
		this.upper = (+this.values[this.values.length-1].upper).toFixed(2)
  },

  watch: {
    datasetSelection: { // store
      // deep: true,
      handler (ds) {
        if (ds[this.tab] && ds[this.tab].ranged) {
          if (ds[this.tab].ranged.index!=this.columnIndex && this.selected.length>0) {
            this.selected = []
          }
          else if (ds[this.tab].ranged.index==this.columnIndex && !arraysEqual(this.selected,ds[this.tab].ranged.indices)){
            this.selected = ds[this.tab].ranged.indices
          }
        }
      }
    }
  },

	methods: {

    updateSelected(v) {

      v = v || []

      if (arraysEqual(this.selected,v)) {
        return
      }
      else {
        this.selected = v
      }


      var { index, ranges } = this.currentSelection.ranged || {}

      ranges = ranges || []
      index = index || -1

      if (
        (!ranges.length && v.length)
        ||
        index===this.columnIndex
        ||
        (v.length && index!==this.columnIndex)
      ) {
        var newRanges = reduceRanges( v.map(index=>[this.values[index].lower, this.values[index].upper]) )
        if (!arraysEqual(ranges,newRanges) || index!=this.columnIndex )
          this.$store.commit('selection',{
            ranged: {
              index: (!!v.length) ? this.columnIndex : -1,
              ranges: newRanges,
              indices: v
            }
          })
      }
    },

    setValueIndex(index) {
      var item = this.values[index]
      if (item)
        this.setValue((+item.lower).toFixed(2),(+item.upper).toFixed(2), item.count)
    },

		setValue (lower, upper, count) {
			this.currentLower = lower
			this.currentUpper = upper
			this.currentCount = `${count}, ${+(count/this.total).toFixed(2)}%`
		},

		getMaxVal (arr) {
			return arr.reduce(
				(max, p) => (p.count > max ? p.count : max),
				arr[0].count
			)
		},

		normVal (val) {
			return (val * 100) / this.maxVal
    },

	}
}
</script>
