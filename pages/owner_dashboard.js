import React from 'react';
import DBNavBar from '../components/DBNavBar';
import OwnerSidebar from '../components/OwnerSidebar';
import styles from '../styles/OwnerDB.module.css';
import { Layout, Row } from 'antd';
import SearchBar from '../components/SearchBar';
import ProjectTabs from "../components/ProjectTabs";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProjectCard from '../components/ProjectCard';
import Link from 'next/link'

const { Content } = Layout;
const dummyProject = {
    author: "Climate Donor",
    curAmt: "26000",
    description: "Dedicated researchers and biologist, focused on saving and salvaging the melting polar caps...",
    id: "7HxK8jelcsao9ZFirG1k",
    location: "Stanford, CA",
    published: "5/29/2021",
    "src": "https://via.placeholder.com/150",
    tagName: "Transportation",
    title: "Saving the Melting Polar Caps",
    totalAmt: "89000",
    updated: "5/29/2021"
}

const OwnerDashboard = () => {
    console.log("owner dashboard")
    return (
        <>
            <Layout>
                <DBNavBar />
                <Content className={styles.dashboardContent}>
                    <OwnerSidebar />
                    <div className={styles.contentDisplay}>
                        <div className={styles.titleBar}>
                            <div className={styles.titleContainer}>
                                <h2>Projects</h2>
                                <Link href='/owner/submission'><button><FontAwesomeIcon icon={faPlus} /></button></Link>
                            </div>
                            <SearchBar />
                        </div>
                        <p className={styles.description}>Edit your projects or provide progress updates to your donors. </p>
                        <Row>
                            <ProjectTabs
                                links={['ALL', 'LIVE', 'PENDING', 'DRAFTS', 'ARCHIVED']}
                                onClick={() => {
                                    console.log("Option Clicked")
                                }}
                            />
                        </Row>
                        <Row>
                            {/* this is just a placeholder project, delete this later */}
                            <ProjectCard project={dummyProject}
                            />
                        </Row>
                    </div>
                </Content>
            </Layout>
        </>
    );
}

export default OwnerDashboard;