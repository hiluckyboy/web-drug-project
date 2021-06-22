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
 * @param data 数据
 * @param config 配置项
 * @return {Array}
 */
treeUtil.buildTreeNodeByParent = function (data, config) {

  let myConfig = Object.assign({}, defaultConfig);
  if (config && typeof config == 'object') {
    myConfig = Object.assign(myConfig, config);
  }
  // 当数据不存在，返回空数组
  if (!data || !data.length || data.length <= 0) {
    return [];
  }
  let root = getRoot(data, myConfig);


  for (let i = root.length - 1; i >= 0; i--) {
    if (root[i] && root[i][myConfig.id]) {
      let child = findChildrenNodesByParentId([...data], root[i][myConfig.id], myConfig);

      if (child && child.length > 0)
        root[i][myConfig.children] = child;
    }
  }
  return root;
}
// 获取根节点并把根节点从源数据中删除
let getRoot = function (data, config) {
  let result = [];
  for (let i in data) {
    let isRoot = true;
    let pid = data[i][config.pid];
    for (let j in data) {
      let jid = data[j][config.id];
      if (jid == pid) {
        isRoot = false;
        break;
      }
    }
    if (isRoot) {
      result.push(data[i]);
    }
  }
  return result;
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
