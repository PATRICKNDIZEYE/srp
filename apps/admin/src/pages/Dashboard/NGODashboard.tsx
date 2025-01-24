//
// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import ChartOne from '../../components/Charts/ChartOne';
// import ChartTwo from '../../components/Charts/ChartTwo';
// import ChartThree from '../../components/Charts/ChartThree';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useState } from 'react';
//
// interface Project {
//   id: string;
//   name: string;
//   status: 'active' | 'completed' | 'on-hold';
//   progress: number;
//   budget: number;
// }
//
// interface Activity {
//   id: string;
//   type: 'project' | 'volunteer' | 'event';
//   title: string;
//   description: string;
//   timestamp: string;
// }
//
// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   location: string;
//   type: 'training' | 'meeting' | 'community';
// }
//
// const NGODashboard = () => {
//   const { t } = useTranslation();
//   const [date, setDate] = useState(new Date());
//
//   const recentProjects: Project[] = [
//     {
//       id: '1',
//       name: 'Community Health Initiative',
//       status: 'active',
//       progress: 75,
//       budget: 5000000,
//     },
//     {
//       id: '2',
//       name: 'Youth Education Program',
//       status: 'active',
//       progress: 45,
//       budget: 3500000,
//     },
//     {
//       id: '3',
//       name: 'Agricultural Support',
//       status: 'on-hold',
//       progress: 30,
//       budget: 2800000,
//     },
//   ];
//
//   const statsCards = [
//     {
//       title: 'Active Projects',
//       value: '12',
//       trend: '+2',
//       icon: (
//         <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22">
//           <path d="M17 5H5a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2zm-12 2h4v2H5V7zm0 4h4v2H5v-2zm0 4h4v2H5v-2zm10 2h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z" />
//         </svg>
//       ),
//     },
//     {
//       title: 'Total Volunteers',
//       value: '250',
//       trend: '+15',
//       icon: (
//         <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22">
//           <path d="M11 14.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0-5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM18 19H4a1 1 0 01-1-1v-1a5 5 0 015-5h6a5 5 0 015 5v1a1 1 0 01-1 1z" />
//         </svg>
//       ),
//     },
//   ];
//
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'text-success bg-success/10';
//       case 'completed':
//         return 'text-primary bg-primary/10';
//       case 'on-hold':
//         return 'text-warning bg-warning/10';
//       default:
//         return 'text-gray-500 bg-gray-100';
//     }
//   };
//
//   const recentActivities: Activity[] = [
//     {
//       id: '1',
//       type: 'project',
//       title: 'New Project Started',
//       description: 'Community Health Initiative has been launched',
//       timestamp: '2 hours ago',
//     },
//     {
//       id: '2',
//       type: 'volunteer',
//       title: 'New Volunteers Joined',
//       description: '5 new volunteers registered for Youth Program',
//       timestamp: '5 hours ago',
//     },
//     {
//       id: '3',
//       type: 'event',
//       title: 'Training Completed',
//       description: 'Staff training on new health protocols completed',
//       timestamp: '1 day ago',
//     },
//   ];
//
//   const upcomingEvents: Event[] = [
//     {
//       id: '1',
//       title: 'Community Leaders Meeting',
//       date: '2024-03-20',
//       location: 'Kigali Office',
//       type: 'meeting',
//     },
//     {
//       id: '2',
//       title: 'Volunteer Training Workshop',
//       date: '2024-03-22',
//       location: 'Training Center',
//       type: 'training',
//     },
//     {
//       id: '3',
//       title: 'Community Health Fair',
//       date: '2024-03-25',
//       location: 'Gasabo District',
//       type: 'community',
//     },
//   ];
//
//   // Dummy data for work plans and reports
//   const workPlanStats = {
//     total: 12,
//     active: 5,
//     completed: 4,
//     pending: 3,
//     totalBeneficiaries: 2500,
//     totalBudget: 25000000
//   };
//
//   const reportStats = {
//     totalReports: 24,
//     submittedOnTime: 20,
//     delayed: 4,
//     averageCompletion: 85
//   };
//
//   const areaData = [
//     { name: 'Community Healing', value: 35 },
//     { name: 'Social Reintegration', value: 25 },
//     { name: 'Social Cohesion', value: 40 }
//   ];
//
//   const monthlyProgress = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         name: 'Planned Activities',
//         data: [30, 45, 60, 75, 85, 100]
//       },
//       {
//         name: 'Completed Activities',
//         data: [25, 38, 55, 65, 75, 90]
//       }
//     ]
//   };
//
//   const beneficiaryData = {
//     labels: ['Q1', 'Q2', 'Q3', 'Q4'],
//     male: [300, 450, 600, 750],
//     female: [280, 420, 580, 700],
//     other: [20, 30, 40, 50]
//   };
//
//   return (
//     <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
//         {statsCards.map((card, index) => (
//           <div key={index} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
//               {card.icon}
//             </div>
//
//             <div className="mt-4 flex items-end justify-between">
//               <div>
//                 <h4 className="text-title-md font-bold text-black dark:text-white">
//                   {card.value}
//                 </h4>
//                 <span className="text-sm font-medium">{card.title}</span>
//               </div>
//               <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
//                 {card.trend}
//                 <svg className="fill-meta-3" width="10" height="11" viewBox="0 0 10 11">
//                   <path d="M5 0.5L10 5.5L8.5 7L5 3.5L1.5 7L0 5.5L5 0.5Z" />
//                 </svg>
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//
//       {/* Project Rows */}
//       {recentProjects.map((project) => (
//         <div key={project.id} className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
//           <div className="p-2.5 xl:p-5">
//             <Link to={`/projects/${project.id}`} className="text-black dark:text-white hover:text-primary">
//               {project.name}
//             </Link>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium capitalize ${getStatusColor(project.status)}`}>
//               {project.status}
//             </span>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <div className="relative h-2 w-full rounded-full bg-stroke dark:bg-strokedark">
//               <div
//                 className="absolute left-0 h-full rounded-full bg-primary"
//                 style={{ width: `${project.progress}%` }}
//               ></div>
//             </div>
//             <span className="text-sm font-medium">{project.progress}%</span>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <span className="text-black dark:text-white">
//               {new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(project.budget)}
//             </span>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <div className="flex items-center justify-center space-x-3.5">
//               <button className="hover:text-primary">
//                 <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
//                   <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" />
//                   <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" />
//                 </svg>
//               </button>
//               <button className="hover:text-primary">
//                 <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
//                   <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
//                   <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" />
//                   <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z" />
//                   <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//
//       {/* Charts Section */}
//       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
//         {/* Project Progress Chart */}
//         <div className="col-span-12 xl:col-span-8">
//           <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
//             <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
//               <div className="flex w-full flex-wrap gap-3 sm:gap-5">
//                 <h4 className="text-xl font-semibold text-black dark:text-white">
//                   Project Progress
//                 </h4>
//               </div>
//             </div>
//             <ChartOne />
//           </div>
//         </div>
//
//         {/* Impact Distribution */}
//         <div className="col-span-12 xl:col-span-4">
//           <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
//             <div className="mb-3 justify-between gap-4 sm:flex">
//               <h4 className="text-xl font-semibold text-black dark:text-white">
//                 Impact Distribution
//               </h4>
//             </div>
//             <ChartTwo />
//           </div>
//         </div>
//       </div>
//
//       {/* Additional Dashboard Widgets */}
//       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
//         {/* Calendar Widget */}
//         <div className="col-span-12 xl:col-span-4">
//           <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//             <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//               Calendar
//             </h4>
//             <div className="calendar-widget">
//               <Calendar
//                 onChange={setDate}
//                 value={date}
//                 className="border-none"
//               />
//             </div>
//           </div>
//         </div>
//
//         {/* Recent Activities */}
//         <div className="col-span-12 xl:col-span-4">
//           <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//             <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//               Recent Activities
//             </h4>
//             <div className="flex flex-col gap-4">
//               {recentActivities.map((activity) => (
//                 <div
//                   key={activity.id}
//                   className="flex items-center gap-4 border-b border-stroke pb-4 dark:border-strokedark"
//                 >
//                   <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
//                     activity.type === 'project' ? 'bg-primary/10 text-primary' :
//                     activity.type === 'volunteer' ? 'bg-success/10 text-success' :
//                     'bg-warning/10 text-warning'
//                   }`}>
//                     {activity.type === 'project' ? (
//                       <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
//                         <path d="M2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10ZM11 6V9H14V11H11V14H9V11H6V9H9V6H11Z"/>
//                       </svg>
//                     ) : activity.type === 'volunteer' ? (
//                       <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
//                         <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z"/>
//                         <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z"/>
//                       </svg>
//                     ) : (
//                       <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
//                         <path d="M6 2V4H14V2H16V4H18V8H2V4H4V2H6ZM2 10H18V18H2V10Z"/>
//                       </svg>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <h5 className="font-medium text-black dark:text-white">
//                       {activity.title}
//                     </h5>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {activity.description}
//                     </p>
//                     <span className="text-xs text-gray-400 dark:text-gray-500">
//                       {activity.timestamp}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//
//         {/* Upcoming Events */}
//         <div className="col-span-12 xl:col-span-4">
//           <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//             <div className="flex items-center justify-between mb-6">
//               <h4 className="text-xl font-semibold text-black dark:text-white">
//                 Upcoming Events
//               </h4>
//               <Link
//                 to="/events"
//                 className="text-sm text-primary hover:underline"
//               >
//                 View All
//               </Link>
//             </div>
//             <div className="flex flex-col gap-4">
//               {upcomingEvents.map((event) => (
//                 <div
//                   key={event.id}
//                   className="flex items-center gap-4 border-b border-stroke pb-4 dark:border-strokedark"
//                 >
//                   <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg ${
//                     event.type === 'meeting' ? 'bg-primary/10 text-primary' :
//                     event.type === 'training' ? 'bg-success/10 text-success' :
//                     'bg-warning/10 text-warning'
//                   }`}>
//                     <span className="text-sm font-medium">
//                       {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
//                     </span>
//                     <span className="text-2xl font-bold">
//                       {new Date(event.date).getDate()}
//                     </span>
//                   </div>
//                   <div className="flex-1">
//                     <h5 className="font-medium text-black dark:text-white">
//                       {event.title}
//                     </h5>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {event.location}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Work Plan Overview */}
//       <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
//         <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
//           <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
//             {/* Add icon */}
//           </div>
//           <div className="mt-4 flex items-end justify-between">
//             <div>
//               <h4 className="text-title-md font-bold text-black dark:text-white">
//                 {workPlanStats.total}
//               </h4>
//               <span className="text-sm font-medium">{t('Total Work Plans')}</span>
//             </div>
//             {/* Add trend indicator */}
//           </div>
//         </div>
//         {/* Add similar cards for active, completed, pending */}
//       </div>
//
//       {/* Charts Section */}
//       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
//         {/* Progress Chart */}
//         <div className="col-span-12 xl:col-span-8">
//           <ChartOne
//             title={t('Monthly Progress')}
//             data={monthlyProgress}
//           />
//         </div>
//
//         {/* Area Distribution */}
//         <div className="col-span-12 xl:col-span-4">
//           <ChartTwo
//             title={t('Areas of Intervention')}
//             data={areaData}
//           />
//         </div>
//
//         {/* Beneficiary Distribution */}
//         <div className="col-span-12">
//           <ChartThree
//             title={t('Beneficiary Distribution')}
//             data={beneficiaryData}
//           />
//         </div>
//       </div>
//
//       {/* Recent Activities */}
//       <div className="mt-4 md:mt-6 2xl:mt-7.5">
//         <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//           <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//             {t('Recent Activities')}
//           </h4>
//           {/* Add activity list */}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default NGODashboard;