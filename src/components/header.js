import PropTypes from "prop-types"
import React from "react"
import './header.css'

const Header = (props) => {
  return (
    <header>
      <div className='title-container'>
        <h1 className='title'>
          { props.title }
        </h1>
      </div>
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string,
}

Header.defaultProps = {
  title: ``,
}

export default Header
