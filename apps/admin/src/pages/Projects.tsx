import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsSearch, BsFilter } from 'react-icons/bs';
import fallbackImage from '/images/project-fallback.jpg';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'Community Health Initiative',
      description: 'Improving healthcare access in rural areas of Gasabo',
      status: 'active',
      progress: 75,
      image: '/health-project.jpg',
      region: 'Gasabo',
      budget: 5000000,
      beneficiaries: 1200,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 2,
      name: 'Youth Education Program',
      description: 'Supporting education in Nyarugenge district',
      status: 'active',
      progress: 45,
      image: '/education-project.jpg',
      region: 'Nyarugenge',
      budget: 3500000,
      beneficiaries: 800,
      startDate: '2024-02-15',
      endDate: '2024-11-30'
    },
    {
      id: 3,
      name: 'Agricultural Support',
      description: 'Empowering farmers in Kicukiro',
      status: 'on-hold',
      progress: 30,
      image: '/agriculture-project.jpg',
      region: 'Kicukiro',
      budget: 2800000,
      beneficiaries: 500,
      startDate: '2024-03-01',
      endDate: '2024-10-31'
    }
  ];

  const rwandaRegions = [
    'All Regions',
    'Gasabo',
    'Nyarugenge',
    'Kicukiro',
    'Burera',
    'Gakenke',
    'Gicumbi',
    'Musanze',
    'Rulindo',
    // Add more regions
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || project.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Projects
        </h2>
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <BsSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Filters */}
          <select
            className="rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            {rwandaRegions.map((region) => (
              <option key={region} value={region === 'All Regions' ? 'all' : region}>
                {region}
              </option>
            ))}
          </select>

          <Link
            to="/projects/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary py-2 px-6 text-white hover:bg-opacity-90"
          >
            Add New Project
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative mb-4">
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-48 w-full rounded-sm object-cover"
                  onError={handleImageError}
                />
                <span
                  className={`absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-medium ${
                    project.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                {project.name}
              </h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-stroke dark:bg-strokedark">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  View Details
                </Link>
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="inline-flex items-center justify-center rounded-lg bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 transition-colors duration-300"
                >
                  Edit Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // No Results Found
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-boxdark rounded-lg">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
            No Projects Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            We couldn't find any projects matching your criteria. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects; 