const  fileinput = document.getElementById("fileinput")

fileinput.addEventListener("change",function(event){
    const file = event.target.files[0]
    console.log(file)

    const reader= new FileReader()
 
    reader.onload = function(e){
             const data = e.target.result
             const workbook =XLSX.read(data,{type:'binary'})
             const sheetName = workbook.SheetNames[0]
             const worksheet = workbook.Sheets[sheetName]
             const emaillist = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
             console.log(emaillist)
    }
    




    reader.readAsBinaryString(file);
})