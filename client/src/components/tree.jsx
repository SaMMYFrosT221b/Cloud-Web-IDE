const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      style={{ marginLeft: "10px" }}
    >
      <p className={isDir ? "" : "file-node"}>{fileName}</p>
      {nodes && fileName !=='node_modules' && (
        <ul>
          {Object.keys(nodes).map((child) => {
            return (
              <li >
                <FileTreeNode
                onSelect={onSelect}
                  path={path + "/" + child}
                  fileName={child}
                  nodes={nodes[child]}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  console.log(tree);
  return <FileTreeNode onSelect={onSelect} fileName="/" nodes={tree} path='' />;
};

export default FileTree;
