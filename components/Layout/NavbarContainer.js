import Link from "next/link";
import { Navbar, Nav } from "react-bootstrap";

const NavbarContainer = ({ user }) => {
	return (
		<div className="nav-container">
			<Navbar expand="lg">
				<Navbar.Brand style={{ width: "10%" }}>
					<Link href='/'>
						<a>Home</a>
					</Link>
		 	    </Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto" style={{ width: "100%", justifyContent: "flex-end" }} >
						{user
							?	<>
								<Link href='/mypage'>
									<a>
									마이페이지
									</a>
								</Link>
							</>
							 : <Link href='/signin'>
								<a>
									로그인
								</a>
							</Link>
						}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<style jsx>{`
				.nav-container {
					width: 100%;
					max-width: 1400px; 
					margin: auto;
				}
				a {
					color: #3a3a3a;
					font-size: 18px;
                    cursor: pointer;
				}
				a:hover {
					text-decoration: none;
				}
				@media screen and (max-width:700px){
				}
			`}</style>
		</div>
	);
};

export default NavbarContainer;
