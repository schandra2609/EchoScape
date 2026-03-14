import { jest } from '@jest/globals';

// 1. MOCK THE MODULE FIRST
jest.unstable_mockModule('../src/service/llm.service.js', () => ({
    analyzeJournalText: jest.fn().mockResolvedValue({
        emotion: 'pride',
        keywords: ['achievement', 'mountain', 'perspective'],
        summary: 'A mocked summary about climbing a mountain.'
    })
}));

// 2. DYNAMICALLY IMPORT EVERYTHING ELSE AFTER
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');
const { default: Journal } = await import('../src/models/journal.model.js');

describe('Journal API Endpoints', () => {
    
    const testUserId = 'test-user-999';

    describe('POST /api/v1/journal', () => {
        it('should successfully create a journal entry, analyze it, and save to DB', async () => {
            const dummyEntry = {
                userId: testUserId,
                ambience: 'mountain',
                text: 'Simulated mountain climb text.'
            };

            const response = await request(app).post('/api/v1/journal').send(dummyEntry);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.analysis.emotion).toBe('pride');

            const savedDoc = await Journal.findOne({ userId: testUserId });
            expect(savedDoc).toBeTruthy();
        });

        it('should return a 400 error if required fields are missing', async () => {
            const badEntry = { userId: testUserId, ambience: 'forest' }; // Missing text
            const response = await request(app).post('/api/v1/journal').send(badEntry);
            
            expect(response.status).toBe(422);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/journal/:userId', () => {
        it('should fetch all journal entries for a specific user', async () => {
            // Arrange: Seed the in-memory database with a fake entry directly
            await Journal.create({
                userId: testUserId,
                ambience: 'ocean',
                text: 'Fake ocean text',
                analysis: { emotion: 'calm', keywords: ['water'], summary: 'Fake summary' }
            });

            // Act: Request the entries
            const response = await request(app).get(`/api/v1/journal/${testUserId}`);

            // Assert: Verify we got an array containing our data
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.data[0].ambience).toBe('ocean');
        });
    });

    describe('GET /api/v1/journal/insights/:userId', () => {
        it('should correctly calculate user insights using MongoDB aggregations', async () => {
            // Arrange: Seed the database with two entries to test the math
            await Journal.create([
                {
                    userId: 'stats-user',
                    ambience: 'forest',
                    text: 'Trees',
                    analysis: { emotion: 'peace', keywords: ['trees', 'green'], summary: '...' }
                },
                {
                    userId: 'stats-user',
                    ambience: 'forest',
                    text: 'More trees',
                    analysis: { emotion: 'joy', keywords: ['hiking', 'green'], summary: '...' }
                }
            ]);

            // Act: Hit the insights aggregation endpoint
            const response = await request(app).get('/api/v1/journal/insights/stats-user');

            // Assert: Verify the aggregation logic crunched the numbers correctly
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalEntries).toBe(2);
            expect(response.body.data.mostUsedAmbience).toBe('forest');
            // 'green' appears twice in the seed data, so it should be included in recentKeywords
            expect(response.body.data.recentKeywords).toContain('green'); 
        });
    });

    describe('System Failures & Error Handling (Coverage Boosters)', () => {
        
        it('should return a 404 status and error message for an undefined route', async () => {
            // Act: Request a route that doesn't exist
            const response = await request(app).get('/api/v1/this-route-does-not-exist');

            // Assert: Your app.js should catch this and pass it to the error handler
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        it('should trigger the global error handler and return 500 on a server/database crash', async () => {
            // Arrange: Force the Mongoose 'find' method to throw a fatal error just for this one test
            jest.spyOn(Journal, 'find').mockReturnValueOnce({
                sort: jest.fn().mockRejectedValueOnce(new Error('Simulated Database Crash'))
            });

            // Act: Try to fetch entries (this will hit the broken Journal.find method)
            const response = await request(app).get(`/api/v1/journal/${testUserId}`);

            // Assert: Your controller's catch block should pass this to error.middleware.js
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            
            // Note: Your error handler likely sends a generic message in production 
            // but might send the error stack in development/test. We just verify it exists.
            expect(response.body.message).toBeDefined(); 
        });
    });
});