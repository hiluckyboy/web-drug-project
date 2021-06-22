const treeUtil = {};

const defaultConfig = {
    pid: 'pid',//父级id的字段名
    id: 'id',//本级id的字段名
    children: 'children',// 构建后子节点存放的字段名,
    value: 'value',//数据中value字段的名称
    rootPid: 0 // 根节点的pid
}


/**
 * 将数组类型的数据用pid构建成树结构的数据
 *
 * @param data 数据
 * @param config 配置项
 * @return {Array}
 */
treeUtil.buildTreeNodeByParent = function (data, config) {
  let myConfig = Object.assign({},defaultConfig);
    if (config && typeof config == 'object') {
        myConfig = Object.assign(myConfig, config);
    }
  // 当数据不存在，返回空数组
    if (!data || !data.length || data.length <= 0) {
        return [];
    }
    let root = [];
    // 获取根节点
    for (let i = data.length - 1; i >= 0; i--) {
      let temp = data[i];
      //数据中有pid字段的或者 pid = 0的节点留下
      if (!temp[myConfig.pid] || temp[myConfig.pid] == myConfig.rootPid) {
            data.splice(i, 1);
            root.push(temp);
        }
    }

    for (let i = root.length - 1; i >= 0; i--) {
      if (root[i] && root[i][myConfig.id]) {
        let child = findChildrenNodesByParentId([...data], root[i][myConfig.id], myConfig);
            if (child && child.length > 0)
              root[i][myConfig.children] = child;
        }
    }
    return root;

}
/**
 * 将数组类型的数据用pid构建成树结构的数据展示多个并列的一级父节点
 *
 * @param data 数据
 * @param config 配置项
 * @return {Array}
 */
treeUtil.buildTreeNodeByParentMore = function (data, config) {
  let myConfig = Object.assign({},defaultConfig);
  if (config && typeof config == 'object') {
    myConfig = Object.assign(myConfig, config);
  }
  // 当数据不存在，返回空数组
  if (!data || !data.length || data.length <= 0) {
    return [];
  }
  let root = [];
  // 获取根节点
  for (let i = data.length - 1; i >= 0; i--) {
    let temp = data[i];
    root.push(temp);
  }

  for (let i = root.length - 1; i >= 0; i--) {
    if (root[i] && root[i][myConfig.id]) {
      let child = findChildrenNodesByParentId([...data], root[i][myConfig.id], myConfig);

      if (child && child.length > 0)
        root[i][myConfig.children] = child;
    }
  }
  return root;

}

/**
 * 根据父节点id从数据中递归查找所有子节点
 * @param data
 * @param pid
 * @return {Array}
 */
let findChildrenNodesByParentId = function (data, pid, config) {
    let result = [];
    if (data && data.length > 0) {
        for (let i = data.length - 1; i >= 0; i--) {
            let temp = data[i];
            if (temp && temp[config.pid] == pid) {
                data.splice(i, 1);
                let child = findChildrenNodesByParentId([...data], temp[config.id], config);
                if (child && child.length > 0)
                    temp[config.children] = child;
                result.push(temp);
            }
        }
    }
    return result;
}

export default treeUtil;
