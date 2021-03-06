import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';
import { getToken, getUid } from '@/utils/auth';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount () {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    const token = getToken();
    if (dispatch && token) {
      // console.log(`sencurity模板请求的!`)

      dispatch({
        // type: 'user/fetchCurrent',
        type: 'admin/getInfo',
      });
    }
  }

  render () {
    const { isReady } = this.state;
    const { children, loading, userInfo } = this.props;
    // console.log(userInfo)

    if ((!userInfo.id && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!userInfo.id) {
      return <Redirect to="/user/login"></Redirect>;
    }

    return children;
  }
}

export default connect(({ admin, loading }) => ({
  // currentUser: user.currentUser,
  userInfo: admin.userInfo,
  loading: loading.models.admin,
}))(SecurityLayout);
