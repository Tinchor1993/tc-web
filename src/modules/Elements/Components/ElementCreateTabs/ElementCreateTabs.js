import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.scss'

const ElementCreateTabs = () => (
  <Tabs>
    <TabList>
      <Tab>
        {' '}
        Audio <i className="ti ti-volume" />{' '}
      </Tab>
      <Tab>
        {' '}
        Video <i className="ti ti-video-clapper" />{' '}
      </Tab>
      <Tab>
        {' '}
        Image <i className="ti ti-image" />{' '}
      </Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 3</h2>
    </TabPanel>
  </Tabs>
)
export default ElementCreateTabs
