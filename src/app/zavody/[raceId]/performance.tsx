import React from 'react'
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'

function PerformanceTab() {
    return (
        <div>
            <VerticalTabs defaultValue="0">
                <VerticalTabsList>
                    <VerticalTabsTrigger value="0">02345324sejthkuydsjctngstgmanckjnvwgaj</VerticalTabsTrigger>
                    <VerticalTabsTrigger value="1">1</VerticalTabsTrigger>
                    <VerticalTabsTrigger value="2">2</VerticalTabsTrigger>
                    <VerticalTabsTrigger value="3">3</VerticalTabsTrigger>
                </VerticalTabsList>
                <VerticalTabsContent value="0">
                    000000000
                </VerticalTabsContent>
                <VerticalTabsContent value="1">
                    111111111
                </VerticalTabsContent>
                <VerticalTabsContent value="2">
                    222222222
                </VerticalTabsContent>
                <VerticalTabsContent value="3">
                    333333333
                </VerticalTabsContent>
            </VerticalTabs>
        </div>
    )
}

export default PerformanceTab