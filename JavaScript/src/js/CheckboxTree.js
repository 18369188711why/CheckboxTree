var TreeCheckBox = (function () {
    var oAllContainerDom;
    var oAllRootNode;

    function TreeCheckBox(params) {
        //获取容器节点
        var oParentElement = document.getElementById(params.parentId);
        //创建树的容器节点
        oAllContainerDom = createOneElement("div", params.containerId, {
            class: "tree-container"
        });
        oParentElement.appendChild(oAllContainerDom);
    };
    // interface start
    // initTreeData 传入初始化数据
    TreeCheckBox.prototype.initTreeData = function (treeDatas) {
        initAllTreeDatas(treeDatas);
        initTree();
    };
    // initTreeData 获取全部选中的叶子节点的内容
    TreeCheckBox.prototype.getAllSelectLeafNode = function () {
        var allSelectLeafNode = [];
        getAllSelectLeafNodeEx(oAllRootNode, allSelectLeafNode);
        return allSelectLeafNode;
    };
    //interface end

    /**
     * 获取全部选中的叶子节点
     * @param {*} childItem 
     * @param {*} allSelectLeafNode 
     */
    function getAllSelectLeafNodeEx(childItem, allSelectLeafNode) {
        if (childItem.leaf && childItem.checked) {
            allSelectLeafNode.push(childItem.content);
        }
        if (childItem.children) {
            let oChildren = childItem.children;
            for (let childIndex = 0; childIndex < oChildren.length; childIndex++) {
                let childItem = oChildren[childIndex];
                getAllSelectLeafNodeEx(childItem, allSelectLeafNode);
            }
        }
    };

    
    /**
     * 绘制树
     */
    function initTree() {
        let oAllChildren = oAllRootNode.children;
        for (let dataIndex = 0; dataIndex < oAllChildren.length; dataIndex++) {
            let dataItem = oAllChildren[dataIndex];
            appendOneEleToHtml(dataItem, oAllContainerDom);
        }
    };

    /**
     * 初始化树数据，将数据缓存
     * @param {*} treeDatas 
     */
    function initAllTreeDatas(treeDatas) {
        oAllRootNode = {
            id: (new Date()).valueOf() + "_root",
            children: [],
            level: 0
        };
        for (let dataIndex = 0; dataIndex < treeDatas.length; dataIndex++) {
            let dataItem = treeDatas[dataIndex];
            dataItem.parent = oAllRootNode;
            dataItem.level = 1;
            oAllRootNode.children.push(dataItem);
            initTreeLevel(dataItem, 2);
        }
    };

    /**
     * 根据传入的数据初始化树和树的层级，并且设置叶子节点
     * @param {*} dataItem 单个节点数据
     * @param {*} level 层级
     */
    function initTreeLevel(dataItem, level) {
        let dataItemChildren = dataItem.children;
        if (dataItemChildren) {
            for (let dataIndex = 0; dataIndex < dataItemChildren.length; dataIndex++) {
                dataItemChildren[dataIndex].level = level;
                dataItemChildren[dataIndex].parent = dataItem;
                initTreeLevel(dataItemChildren[dataIndex], level + 1);
            }
        } else {
            dataItem.leaf = true;
        }
    };


    /**
     * 像容器内添加树节点
     * @param {*} dataItem 单个节点数据 
     * @param {*} oContainerDom 树容器
     */
    function appendOneEleToHtml(dataItem, oContainerDom) {
        let oParentDom = createOneCheckBoxElement(dataItem);
        oContainerDom.appendChild(oParentDom);
        if (dataItem.children && dataItem.expand) {
            var childrenItems = dataItem.children;
            for (var childIndex = 0; childIndex < childrenItems.length; childIndex++) {
                appendChildrenElement(childrenItems[childIndex], oParentDom);
            }
        }
    };

    /**
     * 像父亲节点添加孩子节点
     * @param {*} dataItem 单个数据
     * @param {*} oParentDom 父亲dom节点
     */
    function appendChildrenElement(dataItem, oParentDom) {
        let childContainDom = createOneElement("div", dataItem.id + "_childDom", {
            class: "tree_child_container"
        });
        oParentDom.appendChild(childContainDom);
        appendOneEleToHtml(dataItem, childContainDom);
    };

    /**
     * 移除dom树中的单个节点
     * @param {*} treeData 树节点数据
     * @param {*} oParentDom 父亲dom节点
     */
    function removeChildrenElement(treeData, oParentDom) {
        let childContainDom = document.getElementById(treeData.id + "_childDom");
        oParentDom.removeChild(childContainDom);
    };


    /**
     * 根据传入的参数生成一个dom节点
     * @param {*} elementName 节点的dom名称
     * @param {*} id 节点的id
     * @param {*} attrMap 节点的其他属性
     */
    function createOneElement(elementName, id, attrMap) {
        var oDom = document.createElement(elementName);
        oDom.setAttribute("id", id);
        for (var key in attrMap) {
            oDom.setAttribute(key, attrMap[key]);
        }
        return oDom;
    };

    /**
     * 根据节点设置的状态获取节点的样式
     * @param {*} strCheckStatus 状态
     * @returns 样式
     */
    function getCheckboxClassByStatus(strCheckStatus) {
        switch (strCheckStatus) {
            case "warning":
                return "tree-orange";
            case "error":
                return "tree-red";
            case "success":
                return "tree-green";
            case "default":
            default:
                return "tree-blue";
        }
    };


    /**
     * 根据数据创建一个input为checkbox的节点
     * @param {*} data 树节点数据
     * @returns input的dom节点
     */
    function createOneCheckBoxElement(data) {
        let strCheckStatus = getCheckboxClassByStatus(data.status);
        let checkStatusClass = "tree-checkbox";
        let oneCheckBoxContainerEle = createOneElement("div", data.id + "_container_div", {
            class: checkStatusClass,
        });
        let switchStatus = "switch_no_switch";
        if (data.children) {
            switchStatus = data.expand ? "switch_expand" : "switch_collpse";
        }
        let oneSwitchEle = createOneElement("span", data.id + "_span", {
            class: switchStatus
        });
        oneCheckBoxContainerEle.appendChild(oneSwitchEle);

        let checked = data.checked ? true : false;
        let indeterminate = data.indeterminate ? true : false;
        let oneCheckBoxInputEle = createOneElement("input", data.id + "_input", {
            type: "checkbox"
        });

        oneCheckBoxInputEle.onclick = function () {
            // 更新自己
            let isCheck = oneCheckBoxInputEle.checked;
            updateSelfCheckStatusById(data, isCheck);
            // 更新孩子
            updateChildrenCheckStatusById(data, isCheck);
            // 更新父亲
            updateParentCheckStatusById(data.parent);
        };

        oneCheckBoxInputEle.checked = checked;
        oneCheckBoxInputEle.indeterminate = indeterminate;
        oneCheckBoxContainerEle.appendChild(oneCheckBoxInputEle);

        let oneCheckBoxLabelEle = createOneElement("label", data.id, {
            for: data.id + "_input ",
            class:strCheckStatus
        });
        oneCheckBoxLabelEle.innerHTML = data.content;
        oneCheckBoxContainerEle.appendChild(oneCheckBoxLabelEle);

        if (data.children) {
            oneSwitchEle.onclick = function (event) {
                expandOrCollpseById(data, oneSwitchEle, oneCheckBoxContainerEle);
            };
        }
        return oneCheckBoxContainerEle;
    };


    /**
     * 根据数据更新节点的状态
     * @param {*} data 树数据
     * @param {*} isChecked 是否被选中了
     */
    function updateSelfCheckStatusById(data, isChecked) {
        let oriData = getDataByDataIdAndLevel(data);
        oriData.checked = isChecked;
    };

    /**
     * 根据数据更新叶子节点的选中状态
     * @param {*} data 树节点数据
     * @param {*} isChecked 是否被选中了
     */
    function updateChildrenCheckStatusById(data, isChecked) {
        let oriData = getDataByDataIdAndLevel(data);
        if (oriData.children) {
            for (let childIndex = 0; childIndex < data.children.length; childIndex++) {
                let childItem = oriData.children[childIndex];
                childItem.checked = isChecked;
                if (oriData.expand) {
                    document.getElementById(childItem.id + "_input").checked = isChecked;
                    updateChildrenCheckStatusById(childItem, isChecked);
                }
            }
        }
    };

    /**
     * 更新父亲节点是否被选中，或者半选中
     * @param {*} data 树节点数据
     */
    function updateParentCheckStatusById(data) {
        if (data.id === oAllRootNode.id) {
            return;
        }
        let oriParentData = getDataByDataIdAndLevel(data);
        if (oriParentData.children) {
            let oriChildren = oriParentData.children;
            //全都选中状态和全是未选中状态都设置为true
            let isAllChecked = true;
            let isAllUnChecked = true;
            for (let childIndex = 0; childIndex < oriChildren.length; childIndex++) {
                let childItem = oriChildren[childIndex];
                if (childItem.checked) {
                    isAllUnChecked = false;
                } else {
                    isAllChecked = false;
                }
            }
            let isIndeterminate = !isAllChecked && !isAllUnChecked;
            oriParentData.indeterminate = isIndeterminate;
            document.getElementById(oriParentData.id + "_input").indeterminate = isIndeterminate;
            if (!isIndeterminate) {
                if (isAllChecked) {
                    oriParentData.checked = true;
                    document.getElementById(oriParentData.id + "_input").checked = true;
                } else {
                    oriParentData.checked = false;
                    document.getElementById(oriParentData.id + "_input").checked = false;
                }
            }
        }
        updateParentCheckStatusById(oriParentData.parent);
    };

    /**
     * 展开或者折叠节点
     * @param {*} data 树节点数据
     * @param {*} oneSwitchEle 展开节点的dom节点 
     * @param {*} oneCheckBoxContainerEle 节点容器dom节点
     */
    function expandOrCollpseById(data, oneSwitchEle, oneCheckBoxContainerEle) {
        let oriData = getDataByDataIdAndLevel(data);
        if (oriData.expand) {
            oneSwitchEle.className = "switch_collpse";
            oriData.expand = false;
            if (oriData.children) {
                for (let childIndex = 0; childIndex < oriData.children.length; childIndex++) {
                    let childItem = oriData.children[childIndex];
                    removeChildrenElement(childItem, oneCheckBoxContainerEle);
                }
            }
        } else {
            oneSwitchEle.className = "switch_expand";
            oriData.expand = true;
            if (oriData.children) {
                for (let childIndex = 0; childIndex < oriData.children.length; childIndex++) {
                    let childItem = oriData.children[childIndex];
                    appendChildrenElement(childItem, oneCheckBoxContainerEle);
                }
            }
        }
    };

    /**
     * 根据节点数据获取和这个节点level一致的节点
     * @param {*} data 
     */
    function getDataByDataIdAndLevel(data) {
        return getDataByDataIdAndLevelEx(data.id, data.level, oAllRootNode);
    };

    /**
     * 根据id和level获取节点
     * @param {*} dataId id
     * @param {*} dataLevel level 
     * @param {*} oParentNode 父亲节点
     */
    function getDataByDataIdAndLevelEx(dataId, dataLevel, oParentNode) {
        let oChildren = oParentNode.children;
        if (oChildren) {
            for (let childIndex = 0; childIndex < oChildren.length; childIndex++) {
                let childItem = oChildren[childIndex];
                if (childItem.level < dataLevel) {
                    let oDataItem = getDataByDataIdAndLevelEx(dataId, dataLevel, childItem);
                    if (oDataItem) {
                        return oDataItem;
                    }
                } else if (childItem.id === dataId && childItem.level == dataLevel) {
                    return childItem;
                }
            }
        }
    };

    return TreeCheckBox;
}());