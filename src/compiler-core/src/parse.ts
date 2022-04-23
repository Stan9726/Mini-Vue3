import { NodeTypes } from './ast'

const enum TagType {
  Start,
  End
}

export function baseParse(content) {
  const context = createParserContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any[] = []
  const s = context.source

  let node
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }

  if (!node) {
    node = parseText(context)
  }

  nodes.push(node)

  return nodes
}

function parseInterpolation(context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  )

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()

  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    }
  }
}

function parseElement(context) {
  const element = parseTag(context, TagType.Start)

  parseTag(context, context.source)

  return element
}

function parseText(context) {
  const content = parseTextData(context, context.source.length)

  return { type: NodeTypes.TEXT, content: content }
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length)
  advanceBy(context, length)

  return content
}

function parseTag(context, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]

  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.End) {
    return
  }

  return { type: NodeTypes.ELEMENT, tag: tag }
}

function advanceBy(context, length) {
  context.source = context.source.slice(length)
}

function createRoot(children) {
  return {
    children
  }
}

function createParserContext(content) {
  return {
    source: content
  }
}
