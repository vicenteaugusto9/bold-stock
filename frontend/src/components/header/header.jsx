import UserMenu from "../UserMenu/UserMenu";

const Header = ({ users }) => {
    return (
        <div className="header-bar">
            <div className="header-user">
                <UserMenu />
            </div>
        </div>
    );
}

export default Header;