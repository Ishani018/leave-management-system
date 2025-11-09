const request = require('supertest');
const app = require('../../server/server'); // adjust if your server export path differs

// Mock the auth middleware so tests control authentication behavior
jest.mock('../../server/middleware/authMiddleware', () => {
  const fn = (req, res, next) => fn._impl(req, res, next);
  // default: authenticated user
  fn._impl = (req, res, next) => {
    req.user = { id: 'test-user-id' };
    next();
  };
  return fn;
});

// Mock LeaveRequest model constructor/save to avoid DB dependency
jest.mock('../../server/models/LeaveRequest', () => {
  const MockLeaveRequest = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue({ _id: 'mockId', ...data, status: 'Pending' });
    return this;
  });
  return MockLeaveRequest;
});

const authMiddleware = require('../../server/middleware/authMiddleware');
const LeaveRequest = require('../../server/models/LeaveRequest');

describe('POST /api/leave-request', () => {
  afterEach(() => {
    jest.clearAllMocks();
    // restore default auth behavior
    authMiddleware._impl = (req, res, next) => {
      req.user = { id: 'test-user-id' };
      next();
    };
  });

  test('successful leave request returns 201', async () => {
    const res = await request(app)
      .post('/api/leave-request')
      .send({
        leaveType: 'Annual',
        startDate: '2025-01-01',
        endDate: '2025-01-03',
        reason: 'Vacation',
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body.leaveType).toBe('Annual');
    expect(res.body.status).toBe('Pending');
    expect(LeaveRequest).toHaveBeenCalled();
  });

  test('insufficient balance returns 400', async () => {
    const res = await request(app)
      .post('/api/leave-request')
      .send({
        leaveType: 'Annual',
        startDate: '2025-01-01',
        endDate: '2025-01-20', // >10 days
        reason: 'Long trip',
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/Insufficient leave balance/);
  });

  test('not authenticated returns 401', async () => {
    // change mock to simulate unauthenticated middleware behavior
    authMiddleware._impl = (req, res, next) => res.status(401).json({ msg: 'No token' });

    const res = await request(app)
      .post('/api/leave-request')
      .send({
        leaveType: 'Annual',
        startDate: '2025-01-01',
        endDate: '2025-01-02',
        reason: 'x',
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
  });
});