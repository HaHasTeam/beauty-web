export const minifyString=(str:string, length:number = 80
)=>{
    if(str.length>length){
        return str.slice(0,length)+'...'
    }
    return str
}


export const minifyStringId = (str?: string): string => {
  if (!str) return ''
  return str.replace(/-/g, '').toUpperCase().slice(0, 10)
}
