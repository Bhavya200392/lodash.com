import cx from "classnames"
import React from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { useSidebar } from "../../hooks/useSidebar"
import { IGroup, IMethodNode } from "../../types"
import SearchInput from "../SearchInput"
import * as SC from "./styles"

const MethodLink = React.memo(
  ({
    method,
    setCurrentFocus,
  }: {
    method: IMethodNode
    setCurrentFocus: (methodId: string) => void
  }): JSX.Element => {
    const { state: sidebarState } = useSidebar()
    const linkRef = React.useRef<HTMLAnchorElement | undefined>(undefined)

    const isFocused =
      sidebarState.focus.type === "method" && sidebarState.focus.methodId === method.id

    React.useEffect(() => {
      if (isFocused) {
        linkRef.current?.focus()
      }
    }, [isFocused])

    return (
      <div key={method.id}>
        <SC.StyledMethodLink
          innerRef={linkRef}
          // to={`/docs/${method.aliasOf || method.name}`}
          to={`/docs/${method.category.toLowerCase()}/${method.name}`}
          activeClassName="active"
          className={cx({ "is-focused": isFocused })}
          onFocus={() => {
            setCurrentFocus(method.id)
          }}
        >
          _.{method.name}
          {/* {method.aliasOf && ` -> ${method.aliasOf}`} */}
        </SC.StyledMethodLink>
      </div>
    )
  }
)

const MethodGroup = React.memo(
  ({ group, setCurrentFocus }: { group: IGroup; setCurrentFocus: (methodId: string) => void }) => {
    const [expanded, setExpanded] = React.useState(true)
    const { edges: groupMethods } = group

    function toggleExpanded(): void {
      setExpanded((state) => !state)
    }

    return (
      <SC.MethodType key={group.fieldValue}>
        <SC.MethodTypeTitle onClick={toggleExpanded}>
          {expanded ? <SC.Min /> : <SC.Max />} {group.fieldValue}
        </SC.MethodTypeTitle>
        {expanded && (
          <SC.Methods>
            {groupMethods.map((methodNode) => {
              const { node: method } = methodNode
              return (
                <MethodLink key={method.id} method={method} setCurrentFocus={setCurrentFocus} />
              )
            })}
          </SC.Methods>
        )}
      </SC.MethodType>
    )
  }
)

const DocsSidebar = (): JSX.Element => {
  const { actions: sidebarActions, state: sidebarState } = useSidebar()

  return (
    <SC.Sidebar>
      <SearchInput />
      <PerfectScrollbar>
        {sidebarState.filteredGroups.map((group) => {
          return (
            <MethodGroup
              key={group.fieldValue}
              group={group}
              setCurrentFocus={sidebarActions.focusMethod}
            />
          )
        })}
      </PerfectScrollbar>
    </SC.Sidebar>
  )
}

export default React.memo(DocsSidebar)
