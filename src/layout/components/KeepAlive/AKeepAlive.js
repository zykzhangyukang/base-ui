function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
function isRegExp(v) {
  const _toString = Object.prototype.toString
  return _toString.call(v) === '[object RegExp]'
}

const patternTypes = [String, RegExp, Array]

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    if (pattern.indexOf(name) > -1) {
      return true
    } else {
      for (const item of pattern) {
        if (isRegExp(item) && item.test(name)) {
          return true
        }
      }
      return false
    }
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function getComponentKey(vnode) {
  const { componentOptions, key } = vnode
  return key == null
    ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
    : // : key + componentOptions.Ctor.cid
      key
}

function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && (isDef(c.componentOptions) || c.isAsyncPlaceholder)) {
        return c
      }
    }
  }
}

function pruneCache(keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      const componentKey = getComponentKey(cachedNode)
      if (name && !filter(name, componentKey)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

// 删除缓存
function pruneCacheEntry2(cache, key, keys) {
  const cached = cache[key]
  if (cached) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

function pruneCacheEntry(cache, key, keys, current) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

export default {
  name: 'AKeepAlive',
  abstract: true,
  model: {
    prop: 'clearCaches',
    event: 'clear'
  },
  props: {
    include: patternTypes,
    exclude: patternTypes,
    excludeKeys: patternTypes,
    max: [String, Number],
    clearCaches: Array
  },
  watch: {
    clearCaches: function (val) {
      if (val && val.length > 0) {
        const { cache, keys } = this
        val.forEach(key => {
          pruneCacheEntry2(cache, key, keys)
        })
        this.$emit('clear', [])
      }
    }
  },

  created() {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted() {
    // 使用key来
    this.$watch('include', val => {
      pruneCache(this, (name, key) => matches(val, key))
    })
    this.$watch('exclude', val => {
      pruneCache(this, (name, key) => !matches(val, key))
    })
    this.$watch('excludeKeys', val => {
      pruneCache(this, (name, key) => !matches(val, key))
    })
  },

  render() {
    const slot = this.$slots.default
    // 获取keep-alive的第一个子节点（组件），这里要注意是第一个子节点，缓存存的也是这个子节点（组件）
    const vnode = getFirstComponentChild(slot)
    // 获取第一个子节点（组件）的配置信息
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const componentKey = getComponentKey(vnode)
      const { include, exclude, excludeKeys } = this
      if (
        // not included
        (include && (!componentKey || !matches(include, componentKey))) ||
        // excluded
        (exclude && componentKey && matches(exclude, componentKey)) ||
        (excludeKeys && componentKey && matches(excludeKeys, componentKey))
      ) {
        return vnode
      }

      const { cache, keys } = this
      // 这里获取第一个子节点（组件）  的key，
      // 如果没有key则利用ctro.cid和组件的name以及tag值拼接生成一个
      const key =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : // : vnode.key + componentOptions.Ctor.cid
            vnode.key

      // 判断是否存在缓存
      if (cache[key]) {
        // 如果已经存在，则使用缓存更新当前组件
        vnode.componentInstance = cache[key].componentInstance
        // 同时更新Key
        remove(keys, key)
        keys.push(key)
      } else {
        // 如果不存在，则直接存入cache
        // 这里关注cache 和keys
        // 因为我们后续需要操作这两个变量进行缓存删除
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
