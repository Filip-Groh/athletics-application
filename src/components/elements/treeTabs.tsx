import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible"  
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'
import { ChevronsUpDown } from "lucide-react"
import { Button } from "~/components/ui/button"

export interface SingleNode {
    triggerText: string,
    uniqueId: string,
    content: React.ReactNode,
    isDropdown: false
}

export interface DropdownNode {
    triggerText: string,
    uniqueId: string,
    content: React.ReactNode,
    isDropdown: true,
    dropdownNodes: SingleNode[]
}

function DropdownTabTrigger({triggerText, uniqueId, dropdownNodes}: {triggerText: string, uniqueId: string, dropdownNodes: {triggerText: string, uniqueId: string}[]}) {
    const [isOpen, setIsOpen] = React.useState(false)
    
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className='flex'>
                <VerticalTabsTrigger key={`${triggerText}(${uniqueId})Trigger`} value={uniqueId}>{triggerText}</VerticalTabsTrigger>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                {dropdownNodes.map((dropdownNode, index) => {
                    return <VerticalTabsTrigger key={`${triggerText}_${index}(${dropdownNode.uniqueId})Trigger`} value={dropdownNode.uniqueId}>{dropdownNode.triggerText}</VerticalTabsTrigger>
                })}
            </CollapsibleContent>
        </Collapsible>
    )
}

function DropdownTabContent({triggerText, uniqueId, content, dropdownNodes}: {triggerText: string, uniqueId: string, content: React.ReactNode, dropdownNodes: {uniqueId: string, content: React.ReactNode}[]}) {
    return (
        <>
            <VerticalTabsContent key={`${triggerText}(${uniqueId})Content`} value={uniqueId}>
                {content}
            </VerticalTabsContent>
            {dropdownNodes.map((dropdownNode, index) => {
                return (
                    <VerticalTabsContent key={`${triggerText}_${index}(${dropdownNode.uniqueId})Content`} value={dropdownNode.uniqueId}>
                        {dropdownNode.content}
                    </VerticalTabsContent>
                )
            })}
        </>
    )
}

function TreeTabs({tree}: {tree: (DropdownNode | SingleNode)[]}) {
    return (
        <VerticalTabs defaultValue={tree[0]?.uniqueId}>
            <VerticalTabsList>
                {tree.map((node) => {
                    if (node.isDropdown) {
                        return <DropdownTabTrigger key={`${node.triggerText}(${node.uniqueId})Trigger`} triggerText={node.triggerText} uniqueId={node.uniqueId} dropdownNodes={node.dropdownNodes}/>
                    } else {
                        return <VerticalTabsTrigger key={`${node.triggerText}(${node.uniqueId})Trigger`} value={node.uniqueId}>{node.triggerText}</VerticalTabsTrigger>
                    }
                })}
            </VerticalTabsList>
                {tree.map((node) => {
                    if (node.isDropdown) {
                        return (
                            <DropdownTabContent key={`${node.triggerText}(${node.uniqueId})Content`} triggerText={node.triggerText} uniqueId={node.uniqueId} content={node.content} dropdownNodes={node.dropdownNodes}/>
                        )
                    } else {
                        return (
                            <VerticalTabsContent key={`${node.triggerText}(${node.uniqueId})Content`} value={node.uniqueId}>
                                {node.content}
                            </VerticalTabsContent>
                        )
                    }
                })}
        </VerticalTabs>
    )
}

export default TreeTabs