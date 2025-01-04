import React from 'react'
import ReactDOM from 'react-dom'
import ReactSelect from 'react-select'

export default class Select extends ReactSelect {
    renderOuter(options, valueArray, focusedOption) {
        const dimensions = this.wrapper ? this.wrapper.getBoundingClientRect() : null
        const menu = super.renderMenu(options, valueArray, focusedOption)

        if (!menu || !dimensions) return null

        const maxHeight = document.body.offsetHeight - (dimensions.top + dimensions.height)
        return ReactDOM.createPortal(
            <div
                ref={ref => { this.menuContainer = ref }}
                className="Select-menu-outer"
                onClick={(e) => { e.stopPropagation() }}
                style={{
                    ...this.props.menuContainerStyle,
                    zIndex: 9999,
                    position: 'absolute',
                    width: dimensions.width,
                    top: dimensions.top + dimensions.height,
                    left: dimensions.left,
                    maxHeight: Math.min(maxHeight, 200),
                    overflow: 'hidden'
                }}
            >
                <div
                    ref={ref => { this.menu = ref }}
                    role="listbox"
                    tabIndex={-1}
                    className="Select-menu"
                    id={`${this._instancePrefix}-list`}
                    style={{
                        ...this.props.menuStyle,
                        maxHeight: Math.min(maxHeight, 200)
                    }}
                    onScroll={this.handleMenuScroll}
                    onMouseDown={this.handleMouseDownOnMenu}
                >
                    {menu}
                </div>
            </div>,
            document.body
        )
    }
}