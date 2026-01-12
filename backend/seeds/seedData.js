require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Building = require('../models/Building');
const Flat = require('../models/Flat');
const Bill = require('../models/Bill');
const TreeSubmission = require('../models/TreeSubmission');
const ProblemReport = require('../models/ProblemReport');
const BookingRequest = require('../models/BookingRequest');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Building.deleteMany();
        await Flat.deleteMany();
        await Bill.deleteMany();
        await TreeSubmission.deleteMany();
        await ProblemReport.deleteMany();
        await BookingRequest.deleteMany();

        console.log('🗑️  Cleared existing data');

        // Create users
        const admin = await User.create({
            username: 'admin',
            email: 'admin@housefit.local',
            password: 'Admin@123',
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            phone: '01712345678',
        });

        const owner1 = await User.create({
            username: 'owner1',
            email: 'owner1@test.com',
            password: 'Owner@123',
            role: 'owner',
            firstName: 'John',
            lastName: 'Owner',
            phone: '01723456789',
        });

        const tenant1 = await User.create({
            username: 'tenant1',
            email: 'tenant1@test.com',
            password: 'Tenant@123',
            role: 'tenant',
            firstName: 'Alice',
            lastName: 'Tenant',
            phone: '01734567890',
            treePoints: 25,
        });

        const tenant2 = await User.create({
            username: 'tenant2',
            email: 'tenant2@test.com',
            password: 'Tenant@123',
            role: 'tenant',
            firstName: 'Bob',
            lastName: 'Tenant',
            phone: '01745678901',
            treePoints: 15,
        });

        const visitor1 = await User.create({
            username: 'visitor1',
            email: 'visitor1@test.com',
            password: 'Visitor@123',
            role: 'visitor',
            firstName: 'Charlie',
            lastName: 'Visitor',
            phone: '01756789012',
        });

        const employee1 = await User.create({
            username: 'employee1',
            email: 'emp1@test.com',
            password: 'Employee@123',
            role: 'employee',
            firstName: 'David',
            lastName: 'Employee',
            phone: '01767890123',
        });

        console.log('👥 Created users');

        // Create buildings
        const building1 = await Building.create({
            name: 'Green Villa',
            address: 'Dhanmondi, Dhaka',
            totalFloors: 8,
            totalFlats: 16,
            facilities: ['Parking', 'Elevator', 'Security', 'Rooftop Garden'],
            managerId: admin._id,
        });

        const building2 = await Building.create({
            name: 'Blue Heights',
            address: 'Gulshan, Dhaka',
            totalFloors: 10,
            totalFlats: 20,
            facilities: ['Gym', 'Swimming Pool', 'Parking', 'Elevator', '24/7 Security'],
            managerId: admin._id,
        });

        const building3 = await Building.create({
            name: 'Royal Apartments',
            address: 'Banani, Dhaka',
            totalFloors: 6,
            totalFlats: 12,
            facilities: ['Parking', 'Elevator', 'Backup Generator'],
            managerId: admin._id,
        });

        console.log('🏢 Created buildings');

        // Create flats
        const flat1 = await Flat.create({
            buildingId: building1._id,
            flatNumber: 'A-101',
            floor: 1,
            area: 1200,
            bedrooms: 3,
            bathrooms: 2,
            rent: 25000,
            status: 'occupied',
            currentTenant: tenant1._id,
            ownerId: owner1._id,
            amenities: ['Balcony', 'Attached Kitchen'],
            description: 'Spacious 3-bedroom apartment in Dhanmondi',
        });

        const flat2 = await Flat.create({
            buildingId: building1._id,
            flatNumber: 'A-201',
            floor: 2,
            area: 1200,
            bedrooms: 3,
            bathrooms: 2,
            rent: 26000,
            status: 'available',
            ownerId: owner1._id,
            amenities: ['Balcony', 'Attached Kitchen'],
            description: 'Beautiful apartment with city view',
        });

        const flat3 = await Flat.create({
            buildingId: building2._id,
            flatNumber: 'B-501',
            floor: 5,
            area: 1500,
            bedrooms: 4,
            bathrooms: 3,
            rent: 35000,
            status: 'occupied',
            currentTenant: tenant2._id,
            ownerId: owner1._id,
            amenities: ['Balcony', 'Master Bedroom', 'Drawing Room'],
            description: 'Luxury apartment in Gulshan',
        });

        for (let i = 1; i <= 5; i++) {
            await Flat.create({
                buildingId: building2._id,
                flatNumber: `B-${i}01`,
                floor: i,
                area: 1400,
                bedrooms: 3,
                bathrooms: 2,
                rent: 30000 + (i * 1000),
                status: 'available',
                ownerId: owner1._id,
                amenities: ['Balcony', 'Parking'],
            });
        }

        console.log('🏠 Created flats');

        // Update user flat references
        tenant1.flatId = flat1._id;
        await tenant1.save();

        tenant2.flatId = flat3._id;
        await tenant2.save();

        // Create bills
        const currentMonth = new Date().toISOString().slice(0, 7);

        await Bill.create({
            flatId: flat1._id,
            tenantId: tenant1._id,
            month: currentMonth,
            rent: 25000,
            electricity: 2000,
            gas: 500,
            water: 300,
            maintenance: 1000,
            discount: 0,
            total: 28800,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            status: 'unpaid',
            generatedBy: admin._id,
        });

        await Bill.create({
            flatId: flat3._id,
            tenantId: tenant2._id,
            month: currentMonth,
            rent: 35000,
            electricity: 2500,
            gas: 600,
            water: 400,
            maintenance: 1500,
            discount: 0,
            total: 40000,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            status: 'unpaid',
            generatedBy: admin._id,
        });

        console.log('💳 Created bills');

        // Create tree submissions
        await TreeSubmission.create({
            userId: tenant1._id,
            imageUrl: '/uploads/trees/sample_tree.jpg',
            location: 'Dhanmondi Lake Area',
            plantedDate: new Date('2025-12-15'),
            aiAnalysis: {
                classification: 'likely_genuine',
                confidence: 0.85,
                reasoning: 'Visible young tree sapling with exposed roots in outdoor soil.',
                modelUsed: 'llama2',
            },
            status: 'approved',
            pointsAwarded: 10,
            reviewedBy: admin._id,
            reviewedAt: new Date(),
            month: '2025-12',
        });

        await TreeSubmission.create({
            userId: tenant1._id,
            imageUrl: '/uploads/trees/sample_tree2.jpg',
            location: 'Nearby Park',
            plantedDate: new Date('2026-01-01'),
            aiAnalysis: {
                classification: 'uncertain',
                confidence: 0.5,
                reasoning: 'Image quality insufficient for proper verification.',
                modelUsed: 'llama2',
            },
            status: 'pending',
            month: '2026-01',
        });

        console.log('🌳 Created tree submissions');

        // Create problem report
        await ProblemReport.create({
            reportedBy: tenant1._id,
            flatId: flat1._id,
            category: 'plumbing',
            priority: 'high',
            title: 'Bathroom sink leak',
            description: 'The bathroom sink has been leaking for two days.',
            status: 'open',
        });

        await ProblemReport.create({
            reportedBy: tenant2._id,
            flatId: flat3._id,
            category: 'electrical',
            priority: 'medium',
            title: 'Bedroom light not working',
            description: 'The main bedroom light stopped working yesterday.',
            status: 'open',
        });

        console.log('🔧 Created problem reports');

        // Create booking request
        await BookingRequest.create({
            visitorId: visitor1._id,
            flatId: flat2._id,
            message: 'I am interested in viewing this flat. Please let me know availability.',
            requestedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            status: 'pending',
        });

        console.log('Created booking request');

        console.log('\n Seed data created successfully!');
        console.log('\n Test Accounts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin:    admin@housefit.local / Admin@123');
        console.log('Owner:    owner1@test.com / Owner@123');
        console.log('Tenant 1: tenant1@test.com / Tenant@123');
        console.log('Tenant 2: tenant2@test.com / Tenant@123');
        console.log('Visitor:  visitor1@test.com / Visitor@123');
        console.log('Employee: emp1@test.com / Employee@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
