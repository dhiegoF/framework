import types from "./types"
import syntax from "./syntax"
import breakPoints from "./breakPoints"
import loadsh from "loadsh"

interface IAnalyzedProps {
  type: string;
  responsiveDesign: string;
  othersArguments: string[]
}

function a(b) {
  let d = b[0]
  let e = 0
  
  for(let c of b) {
    if(e != 0) {
      d += "." + c
    }

    e++
  }

  return d
}

function findSyntaxByPrefix(prefix: string) {
  for(let syntaxObject of syntax) {
    if(syntaxObject.prefix == prefix) {
      return syntaxObject
    }
  }

  return {
    prefix: "",
    prefixReplace: "",
    minProps: 0,
    maxProps: 0,
    props: []
  }
}

function convertToCss(analyzedProps: IAnalyzedProps[]) {
  let final = ""

  for(let analyzedProp of analyzedProps) {
    let local = ""
    const syntaxOfProp = findSyntaxByPrefix(analyzedProp.type)

    
    if(!Array.isArray(analyzedProp.othersArguments)) {
      local = `${syntaxOfProp.prefixReplace}: ${analyzedProp.othersArguments}`
    }else{
      local = `${syntaxOfProp.prefixReplace}: ${loadsh.at(syntaxOfProp.props, a(analyzedProp.othersArguments))}`
    }

    final += " " + local + ";"
  }

  return final
}

function generateOthersArguments(othersArguments: string[]): string[] {
  let modifiedOthersArguments = []

  
  for(let value of othersArguments) {
    let modifiedValue: string = value.replace(/[[]/g, "").replace(/]/g, "")

    //@ts-ignore
    modifiedOthersArguments.push(modifiedValue)
  }

  if(modifiedOthersArguments.length == 1) {
    return modifiedOthersArguments[0]
  }

  return modifiedOthersArguments
}

function generateBreakPoint(prop: string) {
  let breakPoint = ""
  let haveBreakPoint = false
  let modifiedProp = prop.replace(/ /g, "")

  for(let breakPointCode of breakPoints) {
    if(modifiedProp.startsWith(breakPointCode + ":")) {
      haveBreakPoint = true
      breakPoint = breakPointCode
    }
  }

  if(!haveBreakPoint) {
    return "none"
  }

  return breakPoint
}

function analyzer(props: string[]) {
  let analyzedProps: IAnalyzedProps[] = []

  for(let prop of props) {
    let breakPoint = generateBreakPoint(prop)
    let propWithArguments = prop.split("-").filter(value => value !== '')

    let propAnalyzed = {
      type: propWithArguments[0],
      responsiveDesign: breakPoint,
      othersArguments: generateOthersArguments(propWithArguments.slice(1))
    }

    const syntaxOfProp = findSyntaxByPrefix(propAnalyzed.type)

    if(!types.includes(propAnalyzed.type)) {
      throw new Error("Could not find this type of property")
    }

    if((propAnalyzed.othersArguments.length < syntaxOfProp.minProps || propAnalyzed.othersArguments.length > syntaxOfProp.maxProps) && Array.isArray(propAnalyzed.othersArguments)) {
      throw new Error("Is missing arguments to apply the prop or has an overload of arguments")
    }

    analyzedProps.push(propAnalyzed)
  }

  return analyzedProps
}


function format(className: string) {
  return className.replace(/\s\s+/g, ' ');
}

export default function hoonir(className: string) {
  let modifiedClassName = format(className).split(" ")

  return convertToCss(analyzer(modifiedClassName))
}
