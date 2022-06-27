import net from 'net'
import fs, { existsSync}from 'fs'

const port = 8000
const pathArchive = "./arquivos"

const server = net.createServer((socket)=>{
    socket.on("data",(data)=>{
        const varArrayData = contentData(data)
        const mapData = splitLine(data)

            if(existsSync(pathArchive + mapData.requestURI)){
                fs.readFile(pathArchive + mapData.requestURI, 'utf8', (erro, archiveData)=>{
                    if(mapData.requestURI=='/'){
                        socket.write("HTTP/1.1 200 OK\r\n\r\n")
                        socket.write("Para fazer buscar de algum documento, digite /nomeDoDocumento.extensao na barra do navegador para procurar.\r\n")
                        socket.write("Para criar um novo documento, acesse o /home.html na barra do navegador")
                    
                    }else if(mapData.method=='POST'){
                        socket.write("HTTP/1.1 200 OK\r\n\r\n")
                        fs.appendFile(pathArchive + `/${varArrayData.nome}.html`, varArrayData.conteudo, ()=>{})
                        socket.write(`Arquivo com nome ${varArrayData.nome}.html postado com sucesso`)

                    }else if(erro){
                        socket.write("HTTP/1.1 500 INTERNAL SERVER ERROR\r\n\r\n")
    
                    }else{
                        socket.write("HTTP/1.1 200 OK\r\n\r\n")
                        socket.write(archiveData)
                    }
                    socket.end()
                })
            }else{
                socket.write("HTTP/1.1 404 NOT FOUND\r\n\r\n");
                socket.end() 
            }
        } 
    )
})

server.on("error",(e)=>{
    throw e
})

server.listen(port,()=>{
    console.log(`Servidor aberto em: http://localhost:${port}`);
})

function splitLine(data){
    let dataList = data.toString().split(' ')
    let dataObj = {
        method:dataList[0],
        requestURI:dataList[1]
    }

    return dataObj
}


function contentData(data){
    let contentData = data.toString().split('\r\n')
    let content = contentData[contentData.length - 1]
    let contentArray = content.split('&')
    let newArray = []
    for (let i = 0; i<contentArray.length; i++){
        newArray.push(contentArray[i].split('='))
    }

    return Object.fromEntries(newArray)
}