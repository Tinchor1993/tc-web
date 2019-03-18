import React, { Component, PropTypes } from 'react'

import './TabsContainer.scss'
import Tab from '../../Components/Tab/Tab'
import Wizard from '../../../Wizard'

class TabsContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tabs: PropTypes.array,
    children: PropTypes.array,
    defaultTab: PropTypes.string,
    baseUrl: PropTypes.string
  }

  constructor() {
    super()

    this.onNavTabClick = this.onNavTabClick.bind(this)

    this.state = {
      activeTabKey: ''
    }
  }

  componentWillMount() {
    const { defaultTab } = this.props

    if (defaultTab) {
      this.setActiveTabKey(defaultTab)
    }
  }

  getTabsConfig(nodes = []) {
    return nodes.map(node => {
      const key = node.key
      const label = node.props.title

      return {
        key,
        label
      }
    })
  }

  isTabActive(key) {
    return key === this.getActiveTabKey()
  }

  getBaseUrl() {
    return this.props.baseUrl
  }

  getActiveTabKey() {
    return this.state.activeTabKey
  }

  onNavTabClick(key) {
    this.setActiveTabKey(key)
  }

  setActiveTabKey(key) {
    this.setState({
      activeTabKey: key
    })
  }

  buildTabs(tabs) {
    const baseUrl = this.getBaseUrl()

    return tabs.map(tab => {
      const active = this.isTabActive(tab.key)

      const hashedUrl = `${baseUrl}#${tab.key}`

      return (
        <Tab
          key={tab.key}
          id={tab.key}
          isActive={active}
          onClick={this.onNavTabClick}
          hashedUrl={hashedUrl}
          title={tab.label}
        />
      )
    })
  }

  render() {
    const { children, name } = this.props
    const tabs = this.getTabsConfig(children)
    const navTabs = this.buildTabs(tabs)
    const activeTab = this.getActiveTabKey()

    return (
      <div className="tabs-container" id={name}>
        <ul className="nav nav-tabs">{navTabs}</ul>
        <div className="panel panel-default">
          <div className="panel-body">
            <Wizard activeKey={activeTab}>{children}</Wizard>
          </div>
        </div>
      </div>
    )
  }
}

export default TabsContainer
