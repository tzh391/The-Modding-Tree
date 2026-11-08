var layoutInfo = {
    startTab: 'h', startNavTab: 'tree-tab', showTree: true,
    treeLayout: [['h']],
};
addLayer('tree-tab', {
    tabFormat: [['tree', function () { return layoutInfo.treeLayout; }]],
    previousTab: '', leftTab: true,
});
