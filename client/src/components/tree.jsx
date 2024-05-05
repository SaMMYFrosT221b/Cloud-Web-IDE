
const FileTreeNode = ({fileName,nodes}) =>{
    const isDir = !!nodes

    return (
        <div style={{marginLeft: "10px"}}>
            <p className={isDir ? '': "file-node"}>
            {fileName}
            </p>
            {nodes && <ul>
                    {Object.keys(nodes).map((child)=>{
                        return(
                            <li>
                            <FileTreeNode fileName={child} nodes={nodes[child]} />
                        </li>
                        )
                    })}
                </ul>}
        </div>
    )
}

const FileTree = ({tree}) =>{
    console.log(tree);
    return (
        <FileTreeNode fileName='/' nodes={tree}/>
    )
}

export default FileTree