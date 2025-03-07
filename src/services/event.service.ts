import { UserConstant } from '@/constants';
import { Event, IEvent, IUser, Show } from '@/models';
import { ApiError } from '@/utils';

const createEvent = async (eventData: Partial<IEvent>): Promise<IEvent> => {
  const event = await Event.create(eventData);
  return event;
};

const getEvents = async (
  limit: number,
  page: number,
  filters: Record<string, any>,
): Promise<{ events: IEvent[]; totalEvents: number }> => {
  const skip = (page - 1) * limit;

  const [events, totalEvents] = await Promise.all([
    Event.find(filters)
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'shows',
        populate: {
          path: 'ticketTypes',
        },
      })
      .lean(),
    Event.countDocuments(filters),
  ]);

  return { events, totalEvents };
};

const getEventById = async (id: string): Promise<IEvent> => {
  const event = await Event.findById(id)
    .populate({
      path: 'shows',
      populate: {
        path: 'ticketTypes',
      },
    })
    .lean();
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  return event;
};

const updateEvent = async (id: string, user: IUser, updateBody: Partial<IEvent>): Promise<IEvent> => {
  const event = await Event.findOne({
    _id: id,
    $or: [{ createdBy: user._id }, { role: UserConstant.USER_ROLE.ADMIN }],
  })
    .populate({
      path: 'shows',
      populate: {
        path: 'ticketTypes',
      },
    })
    .lean();

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  if (updateBody.url && event.url !== updateBody.url) {
    const isExist = await Event.findOne({
      url: updateBody.url,
      _id: { $ne: id },
    });

    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, 'URL đã tồn tại.');
    }
  }

  Object.assign(event, updateBody);
  await event.save();

  return event;
};

const deleteEvent = async (id: string, user: IUser): Promise<void> => {
  const event = await Event.findOne({
    _id: id,
    $or: [{ createdBy: user._id }, { role: UserConstant.USER_ROLE.ADMIN }],
  });

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  await Event.deleteOne({ _id: id });
};

export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
