import React from 'react'
import { PrimaryNav, MenuLink, Menu, Hamburger } from './NavElement'
import logo from '../Home/logo.png'
const Navbar = () => {
  return (
    <>
      <PrimaryNav>
        <Hamburger />
    <a href='https://cginfinity.com/'>
        <img src={logo}  style={{
           
            height: 60,
            width: 180,
            paddingTop:20
        
            
            
          }} alt='logo' />
    </a>
        <Menu>
          <MenuLink to="/home" activeStyle style={{color:'black' ,fontWeight:'bold', fontSize:20}}>
            Home
          </MenuLink>
          <MenuLink to="/about" activeStyle style={{color:'black',fontWeight:'bold', fontSize:20}}>
            About
          </MenuLink>
          <MenuLink to="/products" activeStyle style={{color:'black',fontWeight:'bold', fontSize:20}}>
            Products
          </MenuLink>
          <MenuLink to="/blog" activeStyle style={{color:'black',fontWeight:'bold', fontSize:20}}>
            Blog
          </MenuLink>
          <MenuLink to="/signIn" activeStyle style={{color:'black' ,fontWeight:'bold', fontSize:20}}>
            SignIn
          </MenuLink>
        </Menu>
      </PrimaryNav>
    </>
  )
}
export default Navbar