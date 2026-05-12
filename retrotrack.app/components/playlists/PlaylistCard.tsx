import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { PlaylistItem } from '@/interfaces/api/playlists/GetPlaylistResponse';
import { playlistCompact, playlistStyles } from '@/styles/playlists';

type Props = {
  playlist: PlaylistItem;
};

export function PlaylistCard({ playlist }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  const handlePress = () => {
    router.navigate('/playlist/' + playlist.id as any);
  };

  return (
    <TouchableOpacity
      style={[playlistStyles.card, c && playlistCompact.card]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {/* Header row */}
      <View style={playlistStyles.cardHeader}>
        <Text style={[playlistStyles.cardTitle, c && playlistCompact.cardTitle]} numberOfLines={1}>
          {playlist.name}
        </Text>
        <View style={playlistStyles.cardBadge}>
          <Text style={playlistStyles.cardBadgeText}>{playlist.isPublic ? 'Public' : 'Private'}</Text>
        </View>
      </View>

      {/* Description */}
      {playlist.description ? (
        <Text
          style={[playlistStyles.cardDesc, c && playlistCompact.cardDesc]}
          numberOfLines={2}
        >
          {playlist.description}
        </Text>
      ) : null}

      {/* Creator */}
      <View style={playlistStyles.creator}>
        <Text style={[playlistStyles.creatorText, c && playlistCompact.creatorText]}>
          by {playlist.createdBy}
        </Text>
      </View>

      {/* Game icon strip */}
      {playlist.icons.length > 0 && (
        <View style={playlistStyles.iconStrip}>
          {playlist.icons.slice(0, 4).map((icon, i) => (
            <Image
              key={i}
              source={{ uri: getGameIconUrl(icon) }}
              style={[playlistStyles.iconSlot, c && playlistCompact.iconSlot]}
            />
          ))}
        </View>
      )}

      {/* Meta row */}
      <View style={playlistStyles.cardMeta}>
        <View style={playlistStyles.cardMetaItem}>
          <Text style={[playlistStyles.cardMetaText, c && playlistCompact.cardMetaText]}>🎮</Text>
          <Text style={[playlistStyles.cardMetaText, c && playlistCompact.cardMetaText]}>
            {playlist.numberOfGames} games
          </Text>
        </View>
        <View style={playlistStyles.cardMetaItem}>
          <Text style={[playlistStyles.cardMetaText, c && playlistCompact.cardMetaText]}>❤️</Text>
          <Text style={[playlistStyles.cardMetaText, c && playlistCompact.cardMetaText]}>
            {playlist.numberOfLikes}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
