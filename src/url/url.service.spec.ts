import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UrlService } from './url.service';

jest.mock('nanoid', () => {
  return {
    nanoid: () => 'nanoid',
  };
});

describe('UrlService', () => {
  let service: UrlService;

  const mockUrlModel = {
    find: jest.fn().mockReturnThis(),
    create: jest
      .fn()
      .mockResolvedValue({ alias: 'alias', expiresAt: new Date() }),
    findOne: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken('Url'),
          useValue: mockUrlModel,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should shorten urls', async () => {
    expect(service).toBeDefined();
    expect(await service.shortenUrl('http://example.com', 'custom')).toEqual(
      'custom',
    );
  });

  it('should throw error when trying to save existing alias', async () => {
    expect(service).toBeDefined();
    mockUrlModel.findOne.mockResolvedValueOnce({
      alias: 'custom',
      expiresAt: new Date(),
    });
    await expect(
      service.shortenUrl('http://example.com', 'custom'),
    ).rejects.toThrow('Alias already in use');
  });

  it('should provide custom unique alias when none provided', async () => {
    expect(service).toBeDefined();

    expect(await service.shortenUrl('http://example.com')).toEqual('nanoid');
  });
});
